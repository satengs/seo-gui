const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    name: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'editor', 'admin', 'superadmin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createSuperAdmin() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gevorgyansatenik83:HID92n88Y3IQUdYO@cluster0.e7mvn.mongodb.net/search-analytics';
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully');

        // Check if superadmin already exists
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
        if (existingSuperAdmin) {
            console.log('Superadmin already exists:', existingSuperAdmin.email);
            return;
        }

        // Create superadmin user
        const superadmin = await User.create({
            email: 'admin@example.com',
            password: 'admin123',
            name: 'Super Admin',
            role: 'superadmin'
        });

        console.log('Superadmin created successfully:', superadmin.email);
    } catch (error) {
        console.error('Failed to create superadmin:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

createSuperAdmin();