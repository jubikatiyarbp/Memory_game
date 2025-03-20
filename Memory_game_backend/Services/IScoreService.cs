public interface IScoreService
{
    Task<int> SubmitScoreAsync(int userId, ScoreRequest scoreReq);

    Task<bool> UpdateScoreAsync(int userId, ScoreRequest scoreReq);
    Task<List<LeaderboardResponse>> GetLeaderboardAsync(string difficultyName);

    Task<List<UserAllScoresResponse>> GetUserScoreHistoryAsync(int userId);

    Task<ScoreResponse> GetScorebyUserIdAndDifficultyIdAsync(int userId, int difficultyId);



}
