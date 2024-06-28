const UserModel = require("../models/user.model.js");

class UserRepository {
    async findOne(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async create(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async save(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
    async findAll() {
        try {
            return await UserModel.find(); 
        } catch (error) {
            throw error;
        }
    }

    
}

module.exports = UserRepository;
