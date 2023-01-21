// eslint-disable-next-line no-undef
const express = require("express");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const app = express();
const { Admin, Election, Question, Voter } = require("./models");
const bodyParser = require("body-parser");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
const path = require("path");
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
const flash = require("connect-flash");

// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname, "views"));
app.use(flash());

app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  response.render("index", {
    title: "Online voting platform",
    csrfToken: request.csrfToken(),
  });
});
app.use(
  session({
    secret: "my-secret-super-key-10181810",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "Email",
      passwordField: "Password",
    },
    (username, password, done) => {
      Admin.findOne({ where: { Email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.Password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid Password" });
          }
        })
        .catch(function () {
          return done(null, false, { message: "Unrecognized Email" });
        });
    }
  )
);
passport.serializeUser((admin, done) => {
  console.log("Serializing user in session", admin.id);
  done(null, admin.id);
});
passport.deserializeUser((id, done) => {
  Admin.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});
app.get("/login", (request, response) => {
  response.render("login", {
    title: "Login",
    csrfToken: request.csrfToken(),
  });
});
app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});
app.post("/admin", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  if (request.body.password.length < 8) {
    request.flash("error", "Password should contain atleast of length 10");
    response.redirect("/signup");
  }
  try {
    const admin = await Admin.create({
      FirstName: request.body.FirstName,
      LastName: request.body.LastName,
      Email: request.body.Email,
      Password: hashedPwd,
    });
    request.login(admin, (err) => {
      if (err) {
        console.log(err);
        response.redirect("/");
      } else {
        response.redirect("/Election");
      }
    });
  } catch (error) {
    request.flash("error", error.message);
    return response.redirect("/signup");
  }
});
app.post(
  "/Election",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const nullString=(request.body.ElectionName).trim()
  if(nullString.length==0){
    request.flash("error","Election Name Should not be Null")
    return response.redirect("/Election/Create")
  }
    const url = request.body.CustomURL;
    function stringHasTheWhiteSpaceOrNot(value) {
      return value.indexOf(" ") >= 0;
    }
    const haswhiteSpace = stringHasTheWhiteSpaceOrNot(url);
    if (haswhiteSpace == true) {
      request.flash("error", "White spaces are not allowed");
      console.log("Spaces found");
      return response.redirect("/Election/Create");
    }

    try {
      await Election.addElection({
        ElectiontName: request.body.ElectionName,
        CustomURL: request.body.CustomURL,
        AdminId: request.user.id,

      });
      return response.redirect("/Election");
    } catch (error) {
      request.flash("error", error.message);
      return response.redirect("/Election");
    }
  }
);
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    console.log(request.user);
    response.redirect("/Election");
  }
);
app.get(
  "/Election",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    let userName = request.user.firstName + " " + request.user.lastName;
    try {
      const elections = await Election.getAllElections(request.user.id);
      // console.log(elections[0].ElectiontName + "eygduighweuidhuih");
      if (request.accepts("html")) {
        response.render("Election", {
          title: "Online voting platform",
          userName,
          elections,
          csrfToken: request.csrfToken(),
        });
      } else {
        return response.json({ Election });
      }
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
),
  app.get(
    "/elections/:id",
    connectEnsureLogin.ensureLoggedIn(),
    async (request, response) => {
      const elections = await Election.getElectionWithId(request.params.id);
      const questionsCount = await Question.countOFQuestions(request.params.id);
      const votersCount = await Voter.countOFVoters(request.params.id);
      console.log(questionsCount);
      return response.render("Question", {
        id: request.params.id,
        title: elections.ElectionName,
        csrfToken: request.csrfToken(),
        QuestionsC: questionsCount,
        votersC: votersCount,
        CustomURL: elections.CustomURL,
      });
    }
  ),
  app.get(
    "/Election/:id/NewQuestion",
    connectEnsureLogin.ensureLoggedIn(),
    async (request, response) => {
      const election = await Election.getElectionWithId(request.params.id);
      const Question = await Question.getQuestionWithId(request.params.id);
      if (Election.isRunning == false) {
        if (request.accepts("html")) {
          return response.render("NewQuestion", {
            title: election.ElectiontName,
            Question: Question,
            csrfToken: request.csrfToken(),
            id: request.params.id,
          });
        } else {
          return response.json({ Question });
        }
      } else {
        request.flash(
          "error",
          "Cannot access questions while election is running"
        );
        return response.redirect(`/election/${request.params.id}`);
      }
    }
  );
app.get(
  "/Election/:id/NewQuestion/Create",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    return response.render("Create-question", {
      id: request.params.id,
      csrfToken: request.csrfToken(),
    });
  }
);
app.get(
  "/Election/Create",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    response.render("CreateElection", {
      title: "New Election",
      csrfToken: request.csrfToken(),
    });
  }
);
app.post(
  "/Election/:id/NewQuestion/Create",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const enteredQuestion = request.body.question.trim();
    if (enteredQuestion.length == 0) {
      request.flash("error", "Question should be something not null");
      return response.redirect(
        `/Election/${request.params.id}/NewQuestion/Create`
      );
    }

    try {
      const question = request.body.question;
      const description = request.body.description;
      const electionId = request.params.id;
      await Question.addNewQuestion({
        question,
        description,
        electionId,
      });
      return response.redirect(`/Election/${request.params.id}`);
    } catch (error) {
      request.flash("error", error);
      return response.redirect(
        `/Election/${request.params.id}/NewQuestion/Create`
      );
    }
  }
);
app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
});
});
module.exports = app;
