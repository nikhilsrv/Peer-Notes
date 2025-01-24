import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const protectRoute = async (req, res, next) => {
	try {

		const token = req.headers["authorization"]
		if (!token) {
			return res.status(401).json({ success:false, message: "Unauthorized - Access" });
		}


		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

		if (!decoded) {
			return res.status(401).json({success:false, message: "Unauthorized - Access"});
		}

		const user = await prisma.user.findUnique({
			where:{
				id:decoded?.userId
			},
			select:{
				id:true,
				email:true,
				userName:true,
				role:true
			}
		})

		if (!user) {
			return res.status(404).json({success:false, message: "No such user exist"});
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ success:false, message: "Internal server error" });
	}
};

export default protectRoute;