import mongoose from "mongoose";

const MenstrualSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: { type: Date, required: true },
    stayTime: { type: Number, default: 5 },
    leaveTime: { type: Number, default: 28 },
    note: { type: String, default: "" }
})
export default mongoose.model("Menstrual", MenstrualSchema)