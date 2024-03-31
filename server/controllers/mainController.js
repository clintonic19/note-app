
/**
 * GET/
 * homePage
 */
exports.homepage = async(req, res) =>{

        const locals = {
            title: 'HomePage',
            description: 'Home Page for Notes App'
        }
        res.render('index', {
            locals,
            layout: '../views/layouts/frontPage'
        });
}

/**
 * GET/
 * About
 */
exports.about = async(req, res) =>{

    const locals = {
        title: 'About',
        description: 'About Page for Notes App'
    }
    res.render('about', locals);
}

exports.faq = async(req, res) =>{

    const locals = {
        title: 'FAQ',
    }
    res.render('faq', locals);
}

exports.features = async(req, res) =>{

    const locals = {
        title: 'Key Features',
    }
    res.render('features', locals);
}