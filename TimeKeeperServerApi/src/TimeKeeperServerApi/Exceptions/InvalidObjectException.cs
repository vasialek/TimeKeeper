using System;
using System.Collections;
using System.Collections.Generic;

namespace TimeKeeperServerApi.Exceptions
{
    public class InvalidObjectException : Exception
    {
        public IEnumerable<string> Errors { get; }

        public InvalidObjectException()
            : this("", null)
        {
        }
        
        public InvalidObjectException(string msg)
            : this(msg, null)
        {
        }
        
        public InvalidObjectException(string msg, IEnumerable<string> errors)
            : base(msg)
        {
            Errors = errors ?? new string[0];
        }
    }
}
