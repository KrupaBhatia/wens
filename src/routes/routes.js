const router = require("express").Router();

const authorController= require("../controller/authorController");
const blogsController= require("../controller/blogController")
const mid = require("../middleware/auth")

router.post("/authors",authorController.createAuthor) 
router.post("/login",authorController.authorLogin)

router.post("/create",mid.authmid,blogsController.blogs)
router.get("/get" , mid.authmid , blogsController.getBlogs)
router.put("/update/:blogId" , mid.authmid ,mid.authorise, blogsController.updateBlog)
router.delete("/delete/:blogId" , mid.authmid ,mid.authorise, blogsController.deleteBlog)


module.exports = router;