using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MarketingDashboardAPI
{
    public class WrongDateExceptionHandler : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            HttpStatusCode status = HttpStatusCode.BadRequest;
            String message = String.Empty;

            var exceptionType = context.Exception.GetType();

             if (exceptionType == typeof(WrongDateException))
            {
                message = context.Exception.Message;
                status = HttpStatusCode.BadRequest;
            }

            context.ExceptionHandled = true;

            HttpResponse response = context.HttpContext.Response;
            response.StatusCode = (int)status;
            response.ContentType = "application/json";
            var err = message;
            response.WriteAsync(err);
        }
    }

    public class WrongDateException : Exception
    {
        public WrongDateException()
        { }

        public WrongDateException(string message)
            : base(message)
        { }
    }
}
