// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GohoVoting is Ownable, ReentrancyGuard {
    IERC20 public immutable GOHO;
    uint256 public constant MINIMUM_GOHO_TO_CREATE_POLL = 1 * 10 ** 18;
    uint256 public constant MINIMUM_GOHO_TO_VOTE = 1 * 10 ** 18;
    uint256 public constant MAX_POLL_DURATION = 30 days;

    struct Option {
        string description;
        uint256 voteCount;
    }

    struct Poll {
        uint256 id;
        address creator;
        string title;
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
        string title,
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

    modifier checkMinimumGohoToCreate() {
        require(
            GOHO.balanceOf(msg.sender) >= MINIMUM_GOHO_TO_CREATE_POLL,
            "GohoVoting: Saldo GOHO insuficiente para criar"
        );
        _;
    }

    modifier checkMinimumGohoToVote() {
        require(
            GOHO.balanceOf(msg.sender) >= MINIMUM_GOHO_TO_VOTE,
            "GohoVoting: Saldo GOHO insuficiente para votar"
        );
        _;
    }

    constructor(address _gohoTokenAddress) Ownable(msg.sender) {
        require(
            _gohoTokenAddress != address(0),
            "GohoVoting: Endereco do token invalido"
        );
        GOHO = IERC20(_gohoTokenAddress);
    }

    function createPoll(
        string memory _title,
        string memory _description,
        string[] memory _optionDescriptions,
        uint256 _durationInDays
    ) external nonReentrant checkMinimumGohoToCreate {
        require(
            bytes(_description).length > 0,
            "GohoVoting: Descricao da enquete vazia"
        );
        require(_optionDescriptions.length >= 2, "GohoVoting: Minimo 2 opcoes");
        require(_durationInDays >= 1, "GohoVoting: Duracao minima de 1 dia");
        require(
            _durationInDays * 1 days <= MAX_POLL_DURATION,
            "GohoVoting: Duracao muito longa"
        );

        for (uint i = 0; i < _optionDescriptions.length; i++) {
            require(
                bytes(_optionDescriptions[i]).length > 0,
                "GohoVoting: Descricao da opcao vazia"
            );
        }

        uint256 pollId = nextPollId;
        Poll storage newPoll = polls[pollId];
        newPoll.id = pollId;
        newPoll.title = _title;
        newPoll.creator = msg.sender;
        newPoll.description = _description;
        newPoll.deadline = block.timestamp + _durationInDays * 1 days;
        newPoll.active = true;

        // aderyn-fp-next-line(costly-loop)
        for (uint i = 0; i < _optionDescriptions.length; i++) {
            newPoll.options.push(
                Option({description: _optionDescriptions[i], voteCount: 0})
            );
        }

        nextPollId++;
        emit PollCreated(
            _title,
            pollId,
            msg.sender,
            _description,
            newPoll.deadline
        );
    }

    function vote(
        uint256 _pollId,
        uint256 _optionId
    ) external nonReentrant checkMinimumGohoToVote {
        Poll storage currentPoll = polls[_pollId];
        require(
            currentPoll.creator != address(0),
            "GohoVoting: Enquete nao existe"
        );
        require(currentPoll.active, "GohoVoting: Enquete inativa");
        require(
            block.timestamp < currentPoll.deadline,
            "GohoVoting: Enquete encerrada"
        );
        require(!currentPoll.hasVoted[msg.sender], "GohoVoting: Ja votou");
        require(
            _optionId < currentPoll.options.length,
            "GohoVoting: Opcao invalida"
        );

        uint256 votePower = GOHO.balanceOf(msg.sender);
        require(votePower > 0, "GohoVoting: Sem poder de voto (0 GOHO)");

        currentPoll.hasVoted[msg.sender] = true;
        currentPoll.options[_optionId].voteCount += votePower;
        currentPoll.totalVotePowerCast += votePower;

        emit Voted(_pollId, msg.sender, _optionId, votePower);
    }

    function getPollDetails(
        uint256 _pollId,
        uint256 _offset,
        uint256 _limit
    )
        external
        view
        returns (
            uint256 id,
            string memory title,
            address creator,
            string memory description,
            string[] memory optionDescriptions,
            uint256[] memory optionVoteCounts,
            uint256 deadline,
            bool active,
            uint256 totalVotePowerCast,
            uint256 totalOptions
        )
    {
        Poll storage p = polls[_pollId];
        require(p.creator != address(0), "GohoVoting: Enquete nao existe");

        totalOptions = p.options.length;

        uint256 cappedLimit = _limit;
        if (_offset >= totalOptions) {
            cappedLimit = 0;
        } else if (cappedLimit > totalOptions - _offset) {
            cappedLimit = totalOptions - _offset;
        }

        optionDescriptions = new string[](cappedLimit);
        optionVoteCounts = new uint256[](cappedLimit);

        for (uint i = 0; i < cappedLimit; i++) {
            uint256 optionIndex = _offset + i;
            optionDescriptions[i] = p.options[optionIndex].description;
            optionVoteCounts[i] = p.options[optionIndex].voteCount;
        }

        return (
            p.id,
            p.title,
            p.creator,
            p.description,
            optionDescriptions,
            optionVoteCounts,
            p.deadline,
            p.active,
            p.totalVotePowerCast,
            totalOptions
        );
    }

    function getPollCount() external view returns (uint256) {
        return nextPollId;
    }

    function closePoll(uint256 _pollId) external nonReentrant {
        Poll storage pollToClose = polls[_pollId];
        require(
            pollToClose.creator != address(0),
            "GohoVoting: Enquete nao existe"
        );
        require(pollToClose.active, "GohoVoting: Enquete ja esta inativa");
        require(
            block.timestamp >= pollToClose.deadline,
            "GohoVoting: Enquete ainda nao encerrou"
        );

        pollToClose.active = false;
        emit PollClosed(_pollId);
    }

    function closePollAdmin(uint256 _pollId) external onlyOwner {
        Poll storage pollToClose = polls[_pollId];
        require(
            pollToClose.creator != address(0),
            "GohoVoting: Enquete nao existe"
        );
        require(pollToClose.active, "GohoVoting: Enquete ja esta inativa");

        pollToClose.active = false;
        emit PollClosed(_pollId);
    }

    function hasVoted(
        uint256 _pollId,
        address _voter
    ) external view returns (bool) {
        require(
            polls[_pollId].creator != address(0),
            "GohoVoting: Enquete nao existe"
        );
        return polls[_pollId].hasVoted[_voter];
    }
}
