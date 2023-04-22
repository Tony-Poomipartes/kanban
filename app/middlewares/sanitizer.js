const sanitizeHtml = require('sanitize-html');

function sanitize(obj) {
  for (const prop in obj){    
    obj[prop] = sanitizeHtml(obj[prop], { allowedTags: []});
  }  
}

function sanitizeMiddleware (req, res, next){

  sanitize(req.query);
  sanitize(req.params);

  if (req.body){
    sanitize(req.body);
  }

  next();
}

module.exports = sanitizeMiddleware;