import { Router } from "express";
import { requireRole } from "../middlewares/auth.middleware";
import { getFigures, getUsers, getProjects,getIdeas,getBlogs,getHackathons,getMentors,deleteBlog,deleteHackathon,deleteIdea,deleteMentor,deleteProject,deleteUser,rejectHackathon,rejectMentor,approveHackathon,approveMentor,sendMailByAdmin
 } from "../controllers/admin.controller.js";            

export const adminRouter = Router();        

adminRouter.get('/getFigures',requireRole(['admin']),getFigures)
adminRouter.get('/users', requireRole(['admin']), getUsers)
adminRouter.get('/projects', requireRole(['admin']), getProjects)       
adminRouter.get('/ideas', requireRole(['admin']), getIdeas)                         
adminRouter.get('/blogs', requireRole(['admin']), getBlogs)                     
adminRouter.get('/mentors', requireRole(['admin']), getMentors)                 
adminRouter.get('/hackathons', requireRole(['admin']), getHackathons)                   
adminRouter.delete('/users/:id', requireRole(['admin']), deleteUser)            
adminRouter.delete('/projects/:id', requireRole(['admin']), deleteProject)                      
adminRouter.delete('/ideas/:id', requireRole(['admin']), deleteIdea)                    
adminRouter.delete('/blogs/:id', requireRole(['admin']), deleteBlog)                
adminRouter.delete('/mentors/:id', requireRole(['admin']), deleteMentor)                    
adminRouter.delete('/hackathons/:id', requireRole(['admin']), deleteHackathon)                                  
adminRouter.post('/rejectMentor/:id', requireRole(['admin']), rejectMentor) 
adminRouter.post('/approveMentor/:id', requireRole(['admin']), approveMentor)   
adminRouter.post('/approveHackathon/:id', requireRole(['admin']), approveHackathon)                     
adminRouter.post('/rejectHackathon/:id', requireRole(['admin']), rejectHackathon)                           
adminRouter.post('/sendMail', requireRole(['admin']), sendMailByAdmin) 

