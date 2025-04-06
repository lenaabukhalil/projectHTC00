import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();

const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets HTC",
  password: "4412106",
  port: 5432,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/first_p", (req, res) => {
  res.render("first_p.ejs");
});

app.get("/home", (req, res) => {
  res.render("home.ejs");
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});
app.get("/privacy", (req, res) => {
  res.render("privacy.ejs");
});
app.get("/about", (req, res) => {
  res.render("about.ejs");
});
app.get("/service", (req, res) => {
  res.render("service.ejs");
});
app.get("/comp-1", (req, res) => {
  res.render("comp-1.ejs");
});
app.get("/profile", (req, res) => {
  res.render("profile.ejs");
});
app.get("/CV", (req, res) => {
  res.render("CV.ejs");
});
app.get("/task_std", (req, res) => {
  res.render("task_std.ejs");
});
app.get("/rating", (req, res) => {
  res.render("rating.ejs");
});
app.get('/companies', (req, res) => {
  res.render('companies.ejs'); //
});
app.get('/courses', (req, res) => {
  res.render('courses.ejs'); //
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get('/register2', (req, res) => {
  res.render('register2.ejs'); // يعرض صفحة التسجيل الجديدة باسم 
});

app.get('/register3', (req, res) => {
  res.render('register3.ejs'); // يعرض صفحة التسجيل الجديدة باسم 
});

app.get('/register4', (req, res) => {
  res.render('register4.ejs'); // يعرض صفحة التسجيل الجديدة باسم 
});
app.get("/", (req, res) => {
  res.render("first_p.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/certi-0", (req, res) => {
  res.render("certi-0.ejs");
});
app.get("/cs", (req, res) => {
  res.render("cs.ejs");
});
app.get("/cis", (req, res) => {
  res.render("cis.ejs");
});

app.get("/ai", (req, res) => {
  res.render("ai.ejs");
});
app.get("/bit", (req, res) => {
  res.render("bit.ejs");
});
app.get("/cyber", (req, res) => {
  res.render("cyber.ejs");
});
app.get('/sw', (req, res) => {
  res.render('sw.ejs'); 
});
app.set('/train', (req, res) => {
  res.render('train.ejs'); 
});
app.get('/train', (req, res) => {
  res.render('train.ejs'); 
});
app.get('/first_p', (req, res) => {
  res.render('first_p'); 
});
app.post('/first_p', (req, res) => {
  res.render('first_p'); // يعرض صفحة التسجيل الجديدة باسم 
});


app.post('/register', (req, res) => {
  res.render('register.ejs'); // يعرض صفحة التسجيل الجديدة باسم 
});

app.post('/register4', (req, res) => {
  res.render('register4.ejs'); // يعرض صفحة التسجيل الجديدة باسم 
});
app.post('/comp-1', (req, res) => {
  res.render('comp-1.ejs'); // يعرض صفحة التسجيل الجديدة باسم 
});

app.get("/register3", (req, res) => {
  res.render("register3.ejs");
});
app.post('/register3', async (req, res) => {
  const { city, university, gpa, gender, specialization } = req.body;

  try {
    console.log('Received data:', { city, university, gpa, gender, specialization }); // طباعة البيانات المستلمة للتأكد
    
    // إدخال البيانات في جدول الطلاب
    const query = `INSERT INTO students (city, university, gpa, gender, specialization) 
                   VALUES ($1, $2, $3, $4, $5)`;
    const result = await db.query(query, [city, university, gpa, gender, specialization]);

    if (result.rowCount > 0) {
      console.log('Data inserted successfully');
      res.redirect('/register3'); // إعادة التوجيه إلى صفحة register4
    } else {
      console.error('No rows affected.');
      res.status(500).send('Error inserting student data');
    }
  } catch (err) {
    console.error('Error executing query:', err); // طباعة تفاصيل الخطأ
    res.status(500).send('Error saving student data');
  }
});



app.post("/register2", async (req, res) => {
  const { username, std_id, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.send("Passwords do not match. Please try again.");
  }

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE std_id = $1", [std_id]);
    if (checkResult.rows.length > 0) {
      return res.send("ID already exists. Try logging in.");
    }

    const emailCheckResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.send("Email already exists. Try logging in.");
    }

    // تجزئة كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إدخال بيانات المستخدم في جدول 'users'
    const result = await db.query(
      "INSERT INTO users (username, std_id, email, password) VALUES ($1, $2, $3, $4)",
      [username, std_id, email, hashedPassword]
    );

    console.log("User data inserted successfully.");
    res.render("register2.ejs", { message: "Registration successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
});


app.post("/login", async (req, res) => {
  const { std_id, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE std_id = $1", [std_id]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.render("home.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/delete-account", async (req, res) => {
  const std_id = req.body.std_id; // يستلم الـ std_id من النموذج المخفي
  
  try {
    // حذف الحساب من قاعدة البيانات باستخدام الـ std_id
    const result = await db.query("DELETE FROM users WHERE std_id = $1", [std_id]);
    
    // التحقق من وجود الحساب قبل الحذف
    if (result.rowCount > 0) {
      res.send("Your account has been deleted successfully.");
    } else {
      res.send("Error: Account not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});
app.post("/delete-account", async (req, res) => {
  const { std_id } = req.body;

  try {
    //  حذف المستخدم من قاعدة البيانات
    const result = await db.query("DELETE FROM users WHERE std_id = $1", [std_id]);

    if (result.rowCount > 0) {
      res.send("Your account has been deleted successfully.");
    } else {
      res.send("Error: Account not found.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
}); import nodemailer from 'nodemailer';
import pkg from 'pg';
const { Client } = pkg;

// إعداد الاتصال بقاعدة البيانات
const client = new Client({
  user: "postgres",      // اسم المستخدم
  host: 'localhost',     // مضيف قاعدة البيانات
  database: "secrets HTC",  // اسم قاعدة البيانات
  password: "4412106",  // كلمة مرور قاعدة البيانات
  port: 5432,            // رقم المنفذ الافتراضي
});

client.connect();

// إعداد SMTP لإرسال الإيميل
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com", // استبدل ببريدك الإلكتروني
    pass: "your_email_password", // استبدل بكلمة مرور البريد الإلكتروني
  },
});


app.use(bodyParser.json());

// إرسال OTP وحفظه في قاعدة البيانات
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required!");
  }

  try {
    // Check if the user exists
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    let otp;
    let expiresAt;

    if (result.rows.length === 0) {
      // If user is not found, insert them into the database with a placeholder password
      otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP (6 digits)
      expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
      // Generate a placeholder std_id (e.g., a random number)
      const stdId = Math.floor(100000 + Math.random() * 900000);
    
      const placeholderPassword = "default_password"; // Placeholder password
    
      const insertQuery = `
        INSERT INTO users (email, otp, otp_expires_at, std_id, password)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const insertValues = [email, otp, expiresAt, stdId, placeholderPassword];
      const insertResult = await client.query(insertQuery, insertValues); // Insert user with OTP into the database
    
      if (insertResult.rowCount === 0) {
        throw new Error('Failed to insert user into the database');
      }
    
      console.log(`New user added with email: ${email}`);
    }
     else {
      // If user exists, generate OTP and expiration time for them
      otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP (6 digits)
      expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      const updateQuery = `
        UPDATE users
        SET otp = $1, otp_expires_at = $2
        WHERE email = $3
      `;
      const updateValues = [otp, expiresAt, email];
      const updateResult = await client.query(updateQuery, updateValues); // Update OTP for existing user

      if (updateResult.rowCount === 0) {
        throw new Error('Failed to update OTP in the database');
      }

      console.log(`OTP updated for existing user with email: ${email}`);
    }

    // Send OTP via email
    const mailOptions = {
      from: "lenabukhalil98@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("OTP sent and saved to the database successfully!");
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send(`Failed to send OTP or save it to the database: ${error.message}`);
  }
});

// التحقق من OTP المدخل
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send("Email and OTP are required!");
  }

  try {
    // Retrieve OTP and expiration time from the database
    const result = await client.query(
      'SELECT otp, otp_expires_at FROM public.users WHERE email = $1',
      [email]
    );

    const userRecord = result.rows[0];

    if (!userRecord) {
      return res.status(404).send("User not found.");
    }

    // Check if the OTP matches and if it's expired
    const currentTime = new Date();
    if (userRecord.otp !== otp) {
      return res.status(400).send("Invalid OTP.");
    }

    if (new Date(userRecord.otp_expires_at) < currentTime) {
      return res.status(400).send("OTP has expired.");
    }

    // If OTP is valid and not expired, redirect to /home
    res.redirect("/home");  // This will redirect the user to the /home page

  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).send("Failed to verify OTP.");
  }
});
app.get('/logout', (req, res) => {
  
    res.redirect('/login'); // إعادة التوجيه إلى صفحة تسجيل الدخول
  });



// Start the server


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

