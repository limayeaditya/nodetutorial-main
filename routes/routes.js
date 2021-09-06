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

router.get('/users', authenticate, async (req, res) => {require('./profile/getAllUsers').getAllUsers(req,res)});

router.put('/updateprofile', [authenticate, validate], async (req, res) => { require('./profile/updateProfile').updateProfile(req,res)});

router.put('/updateprofilepicture', [authenticate, validate], async (req, res) => {require('./profile/updateProfilePicture').updateProfilePicture(req,res)});

router.put('/updateprofilepictureurl', [authenticate, validate], async (req, res) => {require('./profile/updateProfilePictureUrl').updateProfilePictureUrl(req,res)});

// Advertisment Routes
router.post('/advertisement', [validate, authenticate], async (req, res) => { require('./advertisement/postAdvertisement').postAdvertisement(req,res)});

router.put('/advertisement', [validate, authenticate], async (req, res) => {require('./advertisement/updateAdvertisement').updateaAvertisement(req,res)});

router.delete('/advertisement', [validate, authenticate], async (req, res) => { require('./advertisement/deleteAdverstisement').deleteAdvertisement(req,res)});

router.get('/advertisements', async (req, res) => {require('./advertisement/getAllAdvertisements').getAllAdvertisements(req,res)});

router.get('/myadvertisements', authenticate, async (req, res) => {require('./advertisement/getMyAdvertisements').getMyAdvertisements(req,res)});

router.get('/advertisement/',authenticate, async (req, res) => {require('./advertisement/getAdvertisement').getAdvertisement(req,res)});

// Subscription Routes
router.post('/subscription', [validate, authenticate], async (req, res) => {require('./subscription/postSubscription').postSubscription(req,res)});
router.get('/subscription',[authenticate], async (req, res) => {require('./subscription/getSubscription').getSubscription(req,res)});

// Default route
router.get('/', async (req, res) => {
    res.status(200).json({
        message: "This app works"
    });
});
module.exports = router;