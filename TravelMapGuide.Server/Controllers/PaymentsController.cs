using Microsoft.AspNetCore.Mvc;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Models.Payment;
using TravelMapGuide.Server.Services;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly IyzipayService _iyzipayService;
    private readonly ITravelService _travelService;

    public PaymentsController(IyzipayService iyzipayService, ITravelService travelService)
    {
        _iyzipayService = iyzipayService;
        _travelService = travelService;
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> MakePayment([FromBody] PaymentRequestModel model)
    {
        var payment = await _iyzipayService.MakePayment(model.CardNumber, model.CardHolderName, model.ExpireMonth, model.ExpireYear, model.Cvc, model.Price);

        if (payment.Status == "success")
        {
            var result = await _travelService.UpdateFeatureStatus(model.TravelId);
            if (result.IsSuccess)
            {
                return Ok(new { message = "ödeme başarıyla alındı", paymentId = payment.PaymentId });
            }

            return BadRequest(new { message = "ödeme alınamadı", errormessage = result.Error });
        }
        return BadRequest(new { message = "ödeme alınamadı", errormessage = payment.ErrorMessage });
    }

    [HttpPost("[action]")]
    public async Task<bool> IsSuccess()
    {
        return true;
    }
}