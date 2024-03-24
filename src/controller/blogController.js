const blogsModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");




const blogs = async function (req, res) {
    try {
      let data = req.body 
  
      if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "Please Provide Valid Blog Details" })
  
      if (!data.title ||typeof data.title!=="string") return res.status(400).send({ status: false, msg: "title is Required" })
  
    //   if (!/^[A-Za-z]$/.test(data.title)) return res.status(400).send({ status: false, msg: "Title  is not in right format" })
  
      if (!data.body ||typeof data.body!=="string") return res.status(400).send({ status: false, msg: "body is Required" })
  
      // if (!/^[A-Za-z][^\.:]*[\.:]$/.test(data.body)) return res.status(400).send({ status: false, msg: "Body isnot in right format" })
  
      if (!data.author_Id ||typeof data.author_Id!=="string") return res.status(400).send({ status: false, msg: "AuthorId is Required" })
  
      let AuthorData = await authorModel.findById(data.author_Id)
  
      if (!AuthorData) return res.status(404).send({ status: false, msg: "No such author found" })
  
      if (!data.tags ) return res.status(400).send({ status: false, msg: "tags is Required" })
  
      if (!(data.category ||typeof data.author_Id!=="string")) return res.status(400).send({ status: false, msg: "Category is Required" })
  
    //   if(!/^[a-zA-Z]+$/.test(data.category)) return res.status(400).send({ status: false, msg: "Category  is not in right format" })
      
      let blogCreate = await blogsModel.create(data)
  
      res.status(201).send({ status: true, msg: "Blog Created Sucessfully", data: blogCreate })
  
    } catch (err) {
      res.status(500).send({ status: "failed", message: err.message });
    }
  };


  let getBlogs = async function (req, res) {
    try {
      let data = await blogsModel.find({ isDeleted: false, isPublished: true }).populate('author_Id');
      if (data.length === 0) return res.status(404).send({ status: false, msg: "Blog not found! " });
  
      res.status(200).send({ status: true, msg: "get blog Sucessfully" ,data: data });
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  };


  const isValidString = function (value) {
    return typeof value === "string" && value.trim().length > 0;
  };
  
  const updateBlog = async function (req, res) {
    try {
      let data = req.body;
      let blog_Id = req.params.blogId;
  
      if (!Object.keys(data).length) {
        return res.status(400).send({ status: false, msg: "Input can't be empty" });
      }
  
      if (!isValidString(data.title)) {
        return res.status(400).send({ status: false, msg: "Title is required" });
      }
  
      if (!isValidString(data.body)) {
        return res.status(400).send({ status: false, msg: "Body is required" });
      }
  
      if (!Array.isArray(data.tags) || data.tags.length === 0) {
        return res.status(400).send({ status: false, msg: "Tags must be provided as a non-empty array" });
      }
  
      let checkBlog = await blogsModel.findById(blog_Id);
      if (!checkBlog) {
        return res.status(404).send({ status: false, msg: "Blog not found" });
      }
  
      if (checkBlog.isDeleted) {
        return res.status(400).send({ status: false, msg: "This blog is already deleted" });
      }
  
      let update = await blogsModel.findByIdAndUpdate(
        blog_Id,
        {
          $set: { title: data.title, body: data.body, isPublished: true, publishedAt: new Date(), tags: data.tags }
        },
        { new: true }
      );
  
      res.status(200).send({ status: true, data: update });
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  };

  
  const deleteBlog = async function (req, res) {
    try {
      let blogId = req.params.blogId;
     
      let blog = await blogsModel.findById(blogId);
      if (!blog) {
        return res.status(404).send("No such blog exists");
      }
      if (blog.isDeleted == true) return res.status(400).send({ status: false, msg: "this blog is already deleted" })
  
      let deleteBlog = await blogsModel.findOneAndUpdate(
        { _id: blogId },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true }
      );
      res.status(201).send({ status: true, data: deleteBlog, msg:"deleted successfully"});
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  

  module.exports ={ blogs ,getBlogs ,updateBlog , deleteBlog}