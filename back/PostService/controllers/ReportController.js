
import Report from  "../models/Report.js"; 


export const createReport = async (req, res, next) => {

    try{
        const  newItem =  new  Report(req.body)  ;  
        await  newItem.save();  
        res.status(201).json({report : newItem}) ;  
    }
    catch(error)
    {
        next(error) ; 
    }

}

export const updateReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const validReasons = [
            'spam',
            'offensive content',
            'misinformation',
            'harassment',
            'inappropriate language',
            'other'
        ];

        // Validate the reason field
        if (!reason || !validReasons.includes(reason)) {
            return res.status(400).json({ error: "Invalid or missing reason provided" });
        }
        // Update only the reason field
        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { reason },
            { new: true, runValidators: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json({ report: updatedReport });
    } catch (error) {
        next(error);
    }
};
