const { Voucher, Gift } = require("../models");

class VoucherControllers {
  static async fetchVoucher(req, res, next) {
    try {
      const data = await Voucher.findAll();

      res.status(200).json(data);
    } catch (error) {
      next(error)
    }
  }

  static async createGift(req, res, next) {
    try {
      const voucherId = +req.params.voucherId;
      const { message, receiverId } = req.body;
      const senderId = req.user.id;
      console.log(req.user.id, '<<<<<')

      
      const data = await Gift.create({
        message,
        senderId,
        amount: 0,
        voucherId,
        receiverId,
      });
      
      if( data === 0) {
        throw { name : 'Not Found'}
      }
      
      res.status(201).json(data);
    } catch (error) {
      next(error)
    }
  }

  static async fetchGift(req, res, next) {
    try {
      const data = await Gift.findAll({
        include: {
          model: Voucher,
          attributes: ['id', 'title', 'imageUrl']
        }
      })

      if( data === 0) {
        throw { name : 'Not Found'}
      }

      res.status(200).json(data)
    } catch (error) {
      console.log(error)
    }
  }

  static async patchGift(req, res, next) {
    try {
      const {id} = req.params
      const { message, amount, receiverId } = req.body

      const data = await Gift.update({message, amount, receiverId}, {
        where: {id},
        returning: true
      });

      if( data === 0) {
        throw { name : 'Not Found'}
      }

      res.status(201).json(data[1][0])

    } catch (error) {
      console.log(error)
    }
  }

  static async deleteGift(req, res, next) {
    try {
      const {id} = req.params
      await Gift.destroy({
        where: {id}
      })

      res.status(200).json({
        message: "Gift has been deleted"
      })
    } catch (error) {
      console.log(error)
    }
  }

  static async patchGiftClaim(req, res, next) {
    try {
      const {id} = req.params
      // const { status } = req.body

      const data = await Gift.update({status : 'Claimed'}, {
        where: {id},
        returning: true
      });

      if( data === 0) {
        throw { name : 'Not Found'}
      }

      res.status(201).json({
        message: "Gift has been claimed"
      })

    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = VoucherControllers;
