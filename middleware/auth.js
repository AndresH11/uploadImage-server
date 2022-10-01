const auth = (req, res, next)=>{
  const key = req.query.key;
  
  if(key !== process.env.KEY ){
    return res.json({
      response : 'no estas autorizado'
    })
  }
  next();
};

module.exports = auth;