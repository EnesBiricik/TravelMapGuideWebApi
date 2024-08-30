namespace TravelMapGuide.Server.Utilities.Helpers
{
    public class Result
    {
        public bool IsSuccess { get; }
        public string Message { get; }
        public string Error { get; }

        // Yeni Token Özelliği
        public string NewToken { get; }

        protected Result(bool isSuccess, string message, string error = null, string newToken = null)
        {
            IsSuccess = isSuccess;
            Message = message;
            Error = error;
            NewToken = newToken;
        }

        public static Result Success(string message = "Action successful.", string newToken = null)
        {
            return new Result(true, message, null, newToken);
        }

        public static Result Failure(string message, string error = null, string newToken = null)
        {
            return new Result(false, message, error, newToken);
        }
    }

    public class Result<T> : Result
    {
        public T Data { get; }

        protected Result(bool isSuccess, string message, T data = default, string error = null)
            : base(isSuccess, message, error)
        {
            Data = data;
        }

        public static Result<T> Success(T? data, string message = "Action successful.")
        {
            return new Result<T>(true, message, data);
        }

        public static Result<T> Failure(string message, string error = null)
        {
            return new Result<T>(false, message, default, error);
        }
    }
}
