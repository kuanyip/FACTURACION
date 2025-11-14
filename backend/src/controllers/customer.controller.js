const asyncHandler = require('../utils/asyncHandler');
const customerService = require('../services/customer.service');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const customers = await customerService.findAll();
    res.json({ data: customers });
  }),

  create: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const customer = await customerService.createCustomer(body);
    res.status(201).json({ data: customer });
  }),

  update: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const updated = await customerService.updateCustomer(params.id, body);
    res.json({ data: updated });
  }),

  remove: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await customerService.deleteCustomer(params.id);
    res.status(204).send();
  })
};
