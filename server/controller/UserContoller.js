import bcrypt from "bcrypt";
const getAllUser= async(req,res)=>{
    try {
        const result = await req.context.models.users.findAll()
        res.status(200).send(result);
    } catch (error) {
        res.status(404).json(error.message)
    }
}

const createUser = async(req,res)=>{
    try {
        const cekUseremail= await req.context.models.users.findAll({
            where:{
                email:req.body.user_email
            }
        })
        
        if(cekUseremail.length===0){
            const salt = await bcrypt.genSalt(10)
            let hashPasword = req.body.pass
            hashPasword = await bcrypt.hash(hashPasword,salt)

            const result = await req.context.models.users.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email:req.body.user_email,
                pass: hashPasword
            })
            res.status(200).send(result);
        }else{
            res.status(404).send('email already exist!')
        }
    } catch (error) {
        res.status(404).json(error.message)
    }

}

const findUserById = async(req,res)=>{
    try {
        const result = await req.context.models.users.findOne({
            where:{
                user_id: req.params.id
            }
        })
        res.status(200).send(result);
    } catch (error) {
        res.status(404).json(error.message)
    }
}

const updateUser = async(req,res)=>{
    try {
        const salt = await bcrypt.genSalt(10)
        let hashPasword = req.body.pass
        hashPasword = await bcrypt.hash(hashPasword,salt)

        const result = await req.context.models.users.update({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            pass: hashPasword
        },{
            returning: true, where:{
                user_id:req.params.id
            }
        }
        )
        res.status(200).send(result);
    } catch (error) {
        res.status(404).json(error.message)
    }
}

const deleteUser = async(req,res)=>{
    try {
        const result = await req.context.models.users.destroy({
            where:{
                user_id: req.params.id
            }
        })
        
        res.status(200).send('delete '+result+' rows');
    } catch (error) {
        res.status(404).json(error.message)
    }
}



export default{
    getAllUser,
    createUser,
    findUserById,
    updateUser,
    deleteUser
}