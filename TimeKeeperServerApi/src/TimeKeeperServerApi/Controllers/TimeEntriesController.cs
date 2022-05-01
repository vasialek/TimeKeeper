using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Lambda.Core;

using TimeKeeperServerApi.Entities;
using Amazon.DynamoDBv2.DocumentModel;
using TimeKeeperServerApi.Models;
using TimeKeeperServerApi.Interfaces;
using TimeKeeperServerApi.Services;

namespace TimeKeeperServerApi.Controllers
{
    [Route("api/[controller]")]
    public class TimeEntriesController : ControllerBase
    {
        private readonly ITimeEntryValidationService _validationService;
        private readonly ITimeEntryRepository _timeEntryRepository;

        public TimeEntriesController(ITimeEntryValidationService validationService, ITimeEntryRepository timeEntryRepository)
        {
            _validationService = validationService;
            _timeEntryRepository = timeEntryRepository;
        }

        // GET api/timeentries
        [HttpGet]
        public async Task<IEnumerable<TimeEntryDto>> GetAllByUserId(string userId)
        {
            var entries = await _timeEntryRepository.LoadTimeEntriesAsync(userId);

            return entries.ToList();
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

        // POST api/timeentires/update
        [HttpPost]
        [Route("Update")]
        public async Task<TimeEntryDto> UpdateAsync(TimeEntryDto timeEntry)
        {
            await _validationService.ValidateUpdateAsync(timeEntry);
            return await _timeEntryRepository.UpdateAsync(timeEntry);
        }
    }
}
