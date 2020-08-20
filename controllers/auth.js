exports.register_new_user = (UserModel, SchemaValidator, PassHasher, SaltGenerator) => {
    return async (req, res, next) => {
        let { email, password } = req.body;

        try {


            const validated = await SchemaValidator.validate({
                email,
                password
            })

            const existing = await UserModel.findOne({ email: email });
            if (existing) throw new Error('Email already in use');

            const salt = await SaltGenerator();
            const hashedPassword = await PassHasher(password, salt)
            console.log((hashedPassword));

            const userDB = new UserModel({
                email,
                password: hashedPassword
            })

            const saved = await userDB.save();
            res.send(saved._id)

        } catch (error) {
            error.status = 400;
            next(error)
        }
        //console.log(email);
    }
}

exports.login_local_user = (UserModel, SchemaValidator, PassHasher, tokenCreation) => {
    return async (req, res, next) => {
        let { email, password } = req.body;
        try {

            const validated = await SchemaValidator.validate({
                email,
                password
            })

            const existing = await UserModel.findOne({ email: email });
            if (!existing) throw new Error('Email or password is incorrect');

            const correctPass = await PassHasher.compare(password, existing.password)
            if (!correctPass) throw new Error('Email or password is incorrect');

            console.log(tokenCreation(existing._id.toJSON(), process.env.ACCESS_TOKEN_SECRET));
            const accessToken = tokenCreation(existing._id.toJSON(), process.env.ACCESS_TOKEN_SECRET)

            res.send({ accessToken })
            // res.send(existing._id)
        } catch (error) {
            error.status = 400;
            next(error)
        }

    }
}