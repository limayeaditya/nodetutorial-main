require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authentication');
const validate = require('../middleware/validation');
//Profile Routes
router.post('/register', validate, async (req,res)=>{ require('./authentication/register').registerUser(req,res)})

router.post('/login', validate, async (req, res) => { require('./authentication/login').loginUser(req,res)});

router.put('/changepassword', [validate, authenticate], async (req, res) => {require('./profile/changePassword').changepassword(req,res)});

router.get('/myprofile', authenticate, async (req, res) => { require('./profile/myProfile').getMyProfile(req,res)});

router.put('/updateprofile', [authenticate, validate], async (req, res) => { require('./profile/updateProfile').updateProfile(req,res)});

router.put('/updateprofilepicture', [authenticate, validate], async (req, res) => {require('./profile/updateProfilePicture').updateProfilePicture(req,res)});

router.put('/updateprofilepictureurl', [authenticate, validate], async (req, res) => {require('./profile/updateProfilePictureUrl').updateProfilePictureUrl(req,res)});

// Advertisment Routes
router.post('/advertisement', [authenticate], async (req, res) => { require('./advertisement/postAdvertisement').postAdvertisement(req,res)});

router.put('/advertisement', [ authenticate], async (req, res) => {require('./advertisement/updateAdvertisement').updateaAvertisement(req,res)});

router.delete('/advertisement/', [ authenticate], async (req, res) => { require('./advertisement/deleteAdverstisement').deleteAdvertisement(req,res)});

router.get('/advertisements', async (req, res) => {require('./advertisement/getAllAdvertisements').getAllAdvertisements(req,res)});

router.get('/myadvertisements', authenticate, async (req, res) => {require('./advertisement/getMyAdvertisements').getMyAdvertisements(req,res)});

router.get('/advertisement/', async (req, res) => {require('./advertisement/getAdvertisement').getAdvertisement(req,res)});

// Subscription Routes
router.post('/subscription', [ authenticate], async (req, res) => {require('./subscription/postSubscription').postSubscription(req,res)});
router.get('/subscription',[authenticate], async (req, res) => {require('./subscription/getSubscription').getSubscription(req,res)});
// Admin routes
router.get('/users', authenticate, async (req, res) => {require('./admin/getAllUsers').getAllUsers(req,res)});
router.delete('/user/', authenticate, async (req, res) => {require('./admin/deleteUser').deleteUser(req,res)});
router.put('/approve/', authenticate, async (req, res) => {require('./admin/approveAdvertisement').approveAdvertisement(req,res)});
router.delete('/deleteadvertisement/', [validate, authenticate], async (req, res) => { require('./admin/deleteAdvertisement_Admin').deleteAdvertisement_Admin(req,res)});

//Payment Routes
router.post('/razorpay', async (req, res) => {require('./payment/payment').makePayment(req, res)});
router.post('/capture', async (req, res) => {require('./payment/payment').capturePayment(req, res)});

// Default route
router.get('/', async (req, res) => {
    res.status(200).json({
        message: "This app works"
    });
});


router.post('/addinterestedbuyer', [authenticate], async (req, res) => { require('./contact/addInterestedBuyer').addInterestedBuyer(req,res)});
router.get('/user/', async (req, res) => {require('./profile/getUserById').getUserById(req,res)});

module.exports = router;