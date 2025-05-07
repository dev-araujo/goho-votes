// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GoHoVoting is Ownable, ReentrancyGuard {
    IERC20 public immutable GOHO;
    uint256 public constant MINIMUM_GOHO_TO_PARTICIPATE = 10 * 10 ** 18;
    uint256 public constant MAX_POLL_DURATION = 30 days;

    struct Option {
        string description;
        uint256 voteCount;
    }

    struct Poll {
        uint256 id;
        address creator;
        string description;
        Option[] options;
        uint256 deadline;
        bool active;
        mapping(address => bool) hasVoted;
        uint256 totalVotePowerCast;
    }

    uint256 public nextPollId;
    mapping(uint256 => Poll) public polls;

    event PollCreated(
        uint256 indexed pollId,
        address indexed creator,
        string description,
        uint256 deadline
    );
    event Voted(
        uint256 indexed pollId,
        address indexed voter,
        uint256 optionId,
        uint256 votePower
    );
    event PollClosed(uint256 indexed pollId);

    modifier checkMinimumGoho() {
        require(
            GOHO.balanceOf(msg.sender) >= MINIMUM_GOHO_TO_PARTICIPATE,
            "GoHoVoting: Saldo GOHO insuficiente"
        );
        _;
    }

    constructor(address _gohoTokenAddress) Ownable(msg.sender) {
        require(
            _gohoTokenAddress != address(0),
            "GoHoVoting: Endereco do token invalido"
        );
        GOHO = IERC20(_gohoTokenAddress);
    }

    function createPoll(
        string memory _description,
        string[] memory _optionDescriptions,
        uint256 _durationInSeconds
    ) external nonReentrant checkMinimumGoho {
        require(_optionDescriptions.length >= 2, "GoHoVoting: Minimo 2 opcoes");
        require(_durationInSeconds > 0, "GoHoVoting: Duracao invalida");
        require(
            _durationInSeconds <= MAX_POLL_DURATION,
            "GoHoVoting: Duracao muito longa"
        );

        for (uint i = 0; i < _optionDescriptions.length; i++) {
            require(
                bytes(_optionDescriptions[i]).length > 0,
                "GoHoVoting: Descricao da opcao vazia"
            );
        }

        uint256 pollId = nextPollId;
        Poll storage newPoll = polls[pollId];
        newPoll.id = pollId;
        newPoll.creator = msg.sender;
        newPoll.description = _description;
        newPoll.deadline = block.timestamp + _durationInSeconds;
        newPoll.active = true;

        // aderyn-fp-next-line(costly-loop)
        for (uint i = 0; i < _optionDescriptions.length; i++) {
            newPoll.options.push(
                Option({description: _optionDescriptions[i], voteCount: 0})
            );
        }

        nextPollId++;
        emit PollCreated(pollId, msg.sender, _description, newPoll.deadline);
    }

    function vote(
        uint256 _pollId,
        uint256 _optionId
    ) external nonReentrant checkMinimumGoho {
        Poll storage currentPoll = polls[_pollId];
        require(
            currentPoll.creator != address(0),
            "GoHoVoting: Enquete nao existe"
        );
        require(currentPoll.active, "GoHoVoting: Enquete inativa");
        require(
            block.timestamp < currentPoll.deadline,
            "GoHoVoting: Enquete encerrada"
        );
        require(!currentPoll.hasVoted[msg.sender], "GoHoVoting: Ja votou");
        require(
            _optionId < currentPoll.options.length,
            "GoHoVoting: Opcao invalida"
        );

        // aderyn-fp-next-line(reentrancy-state-change)
        uint256 votePower = GOHO.balanceOf(msg.sender);
        require(votePower > 0, "GoHoVoting: Sem poder de voto (0 GOHO)");

        currentPoll.hasVoted[msg.sender] = true;
        currentPoll.options[_optionId].voteCount += votePower;
        currentPoll.totalVotePowerCast += votePower;

        emit Voted(_pollId, msg.sender, _optionId, votePower);
    }

    function getPollDetails(
        uint256 _pollId
    )
        external
        view
        returns (
            uint256 id,
            address creator,
            string memory description,
            string[] memory optionDescriptions,
            uint256[] memory optionVoteCounts,
            uint256 deadline,
            bool active,
            uint256 totalVotePowerCast
        )
    {
        Poll storage p = polls[_pollId];
        require(p.creator != address(0), "GoHoVoting: Enquete nao existe");

        optionDescriptions = new string[](p.options.length);
        optionVoteCounts = new uint256[](p.options.length);

        for (uint i = 0; i < p.options.length; i++) {
            optionDescriptions[i] = p.options[i].description;
            optionVoteCounts[i] = p.options[i].voteCount;
        }

        return (
            p.id,
            p.creator,
            p.description,
            optionDescriptions,
            optionVoteCounts,
            p.deadline,
            p.active,
            p.totalVotePowerCast
        );
    }

    function getPollCount() external view returns (uint256) {
        return nextPollId;
    }

    function closePollAdmin(uint256 _pollId) external onlyOwner {
        Poll storage pollToClose = polls[_pollId];
        require(
            pollToClose.creator != address(0),
            "GoHoVoting: Enquete nao existe"
        );
        require(pollToClose.active, "GoHoVoting: Enquete ja esta inativa");

        pollToClose.active = false;
        pollToClose.deadline = block.timestamp;
        emit PollClosed(_pollId);
    }

    function hasVoted(
        uint256 _pollId,
        address _voter
    ) external view returns (bool) {
        require(
            polls[_pollId].creator != address(0),
            "GoHoVoting: Enquete nao existe"
        );
        return polls[_pollId].hasVoted[_voter];
    }
}
