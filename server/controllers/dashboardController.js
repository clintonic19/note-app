
const Note = require('../models/Notes');
const mongoose = new require('mongoose');

/**
 *  Get Dashboard
 */
exports.dashboard = async (req, res) => {

    let perPage = 8;
    let page = req.query.page || 1

    const locals = {
        title: 'Dashboard',
        description: 'Home Page for Notes App',
    }

    try {
        // const notes = await Note.find({});
        // console.log(notes)
        const notes = await Note.aggregate([
            {
                $sort: { updatedAt: -1, }
            },

            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },

            {
                $project: {
                    title: { $substr: ['$title', 0, 50] },
                    body: { $substr: ['$body', 0, 280] }
                }
            }
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .then();
        const count = await Note.count()

        // Where to place the render page
        return res.render('dashboard/index', {
            username: req.user.firstName,
            locals,
            notes,
            layout: '../views/layouts/dashboard',
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error)
    }
};


/**
 *  Get 
 * Specific Notes from a user
 */
exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id }).where({ user: req.user.id }).lean();
    try {
        if (note) {
            return res.render('dashboard/view_notes', {
                noteID: req.params.id,
                note,
                layout: "../views/layouts/dashboard"
            });
        } else {
            res.status(404).render('404');
            // res.status(404).render('User ID not Found');
        }
    } catch (error) {
        console.log(error)
    }
};

/**
 * PUT
 *  Update/Post
 * Specific Notes from a user
 */
exports.dashboardUpdateNote = async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                body: req.body.body,
                updatedAt: Date.now()
            }
        ).where({ user: req.user.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
};

/**
 * DELETE
 * Specific Notes from a user
 */
exports.dashboardDeleteNote = async (req, res) => {
    try {
        await Note.findOneAndRemove({ _id: req.params.id }).where({ user: req.user.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error)
    }
}

/**
 * GET
 *  Add New Notes
 *  from a user
 */
exports.dashboardAddNote = async (req, res) => {
    try {
        res.render('dashboard/add', {
            layout: "../views/layouts/dashboard",
        });
    } catch (error) {
        console.log(error)
    }
}
/**
 * POST
 *  Submit Add New Notes
 *  from a user
 */
exports.dashboardSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Note.create(req.body)
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    };
};

/**
 * GET
 *  Search Notes
 *  from a user
 */
exports.dashboardSearch = async (req, res) => {
    try {
        res.render('dashboard/search', {
            searchResults: '',
            layout: "../views/layouts/dashboard"
        })
    } catch (error) {
        console.log(error)
    }
};

/**
 * POST
 *  Search Notes
 *  from a user
 */
exports.dashboardSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;

        const removeSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const searchResults = await Note.find({
            $or: [
                { title: { $regex: new RegExp(removeSpecialChars, 'i') } },
                { body: { $regex: new RegExp(removeSpecialChars, 'i') } }
            ]
        }).where({ user: req.user.id });

        res.render('dashboard/search', {
            searchResults,
            layout: "../views/layouts/dashboard"
        });
    } catch (error) {
        console.log(error);
    }
};


