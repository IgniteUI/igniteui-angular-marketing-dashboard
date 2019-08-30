using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MarketingDashboardAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Cors;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MarketingDashboardAPI
{
    [Route("api/[controller]")]
    public class SummaryController : Controller
    {
        // GET: api/<controller>
        [EnableCors("AllowOrigin")]
        [HttpGet]
        public IList<SummaryModel> Get(string startRangeBegin, string startRangeEnd, string endRangeBegin, string endRangeEnd, string locale)
        {
            Resources.Main.Culture = System.Globalization.CultureInfo.CreateSpecificCulture(locale);
            DateTime startRangeBeginDate;
            DateTime startRangeEndDate;
            DateTime endRangeBeginDate;
            DateTime endRangeEndDate;

            bool _continue = true;

            if (!DateTime.TryParse(startRangeBegin, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out startRangeBeginDate)) _continue = false;
            if (!DateTime.TryParse(startRangeEnd, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out startRangeEndDate)) _continue = false;
            if (!DateTime.TryParse(endRangeBegin, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out endRangeBeginDate)) _continue = false;
            if (!DateTime.TryParse(endRangeEnd, null, System.Globalization.DateTimeStyles.AdjustToUniversal, out endRangeEndDate)) _continue = false;

            IList<SummaryModel> models = new List<SummaryModel>();

            try
            {
              SummaryDataRepository.ValidateRanges(startRangeBeginDate, startRangeEndDate, endRangeBeginDate, endRangeEndDate);
            }
            catch (Exception e)
            {
              throw new WrongDateException(e.Message);
            }

             _continue = SummaryDataRepository.RangesAreEqualSize(startRangeBeginDate, startRangeEndDate, endRangeBeginDate, endRangeEndDate);

            if (_continue)
            {
                SummaryDataRepository repository = new SummaryDataRepository();
                repository.CalculateNumberOfDays(startRangeBeginDate, startRangeEndDate);

                var data = SummaryData.CreateCollection(repository);

                models = SummaryModel.CreateCollection(data);
            }
            else
            {
                throw new WrongDateException(Resources.Main.Error);
            }

            return models;
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
    }
}
