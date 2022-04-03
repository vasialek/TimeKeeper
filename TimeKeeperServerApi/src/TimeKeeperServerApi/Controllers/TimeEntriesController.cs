using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Lambda.Core;

using TimeKeeperServerApi.Entities;
using Amazon.DynamoDBv2.DocumentModel;
using TimeKeeperServerApi.Models;

namespace TimeKeeperServerApi.Controllers
{
    [Route("api/[controller]")]
    public class TimeEntriesController : ControllerBase
    {
        public TimeEntriesController()
        {
        }

        // GET api/timeentries
        [HttpGet]
        public async Task<IEnumerable<TimeEntryDto>> Get()
        {
            var result = new List<TimeEntryDto>{
                new TimeEntryDto
                {
                    TimeEntryId = "f43ceb8960cb4fb181dd5ce44d6ecf33",
                    UserId = "9b87607cb7134bc59cde9a96b16322a0",
                    ProjectId = "4f5f9b18b91b46e3aa590fa84f3fced6",
                   
                }
            };
            return result;
        }

        // GET api/timeentries/5
        [HttpGet("{id}")]
        public async Task<TimeEntryDto> Get(string id)
        {
            LambdaLogger.Log($"Looking for TimeEntry by ID {id}");
            return new TimeEntryDto{
                TimeEntryId = id
            };
        }

        // POST api/timeentries
        [HttpPost]
        public async Task<TimeEntryDto> Post([FromBody] TimeEntryDto entry)
        {
            if (entry == null )
            {
                throw new ArgumentException($"Invalid input! {typeof(TimeEntryDto).Name} not informed");
            }

            entry.TimeEntryId = Guid.NewGuid().ToString("N");

            // LambdaLogger.Log($"TimeEntry {entry.TimeEntryId} is added");
            return entry;
        }
    }
}
