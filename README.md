# doctruyenchuonline
 
backend: cd backend
npm install express express-session jsonwebtoken mongoose bcrypt bcryptjs  cors  nodemon
npm run dev
{
  "title": "Tên truyện",
  "content": "Nội dung truyện",
  "category": "Thể loại truyện",
  "creationDate": "Ngày tạo truyện (ISO 8601 format)",
  "status": "Trạng thái truyện",
  "thumbnail": "Link hình ảnh bìa truyện",
  "volumes": [
    {
      "chapters": [
        {
          "title": "Tiêu đề chương 1",
          "content": "Nội dung chương 1"
        },
        {
          "title": "Tiêu đề chương 2",
          "content": "Nội dung chương 2"
        }
      ]
    },
    {
      "chapters": [
        {
          "title": "Tiêu đề chương 3",
          "content": "Nội dung chương 3"
        }
      ]
    }
  ]
}
