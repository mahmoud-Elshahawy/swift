var User = require("../Models/user");
var timeJog = require("../Models/timejog");
var md5 = require("md5");

const Register = async function (req, res) {
  const rez = await User.findOne({
    email: req.body.email,
  });
  if (rez) res.send("Sorry This User already exists");
  else {
    const user = new User({
      email: req.body.email,
      password: md5(req.body.password),
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
    });
    try {
      const saved = await user.save();
      res.send({ user: user._id });
    } catch (error) {
      res.status(400).send(error);
    }
  }
};
const Login = async function (req, res) {
  const rez = await User.findOne({
    email: req.body.email,
  });
  if (rez && rez.password == md5(req.body.password)) {
    res.cookie("user", rez._id);
    res.cookie("type", rez.type);
    res.send("LOGGED");
  } else if (rez && rez.password != md5(req.body.password))
    res.send("Please check your password and try again.");
  else res.send("NOT FOUND");
};

const Logout = function (req, res) {
  res.clearCookie("email");
  res.send("Logged Out");
};

const AddTimeJog = async function (req, res) {
  let TimeJog = "";
  if (req.cookies.type == "admin") {
    const rez = await User.findOne({
      email: req.body.email,
    });
    if (rez) {
      TimeJog = new timeJog({
        user: rez._id,
        date: req.body.date,
        distance: req.body.distance,
        time: req.body.time,
      });
    } else res.send("This user isn't found");
  } else {
    TimeJog = new timeJog({
      user: req.cookies.user,
      date: req.body.date,
      distance: req.body.distance,
      time: req.body.time,
    });
  }

  try {
    await TimeJog.save();
    res.send({ TimeJog: TimeJog._id });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getJogs = async function (req, res) {
  let rez = "";
  if (req.cookies.type == "admin") {
    rez = await timeJog.find();
  } else {
    rez = await timeJog.find({
      user: req.cookies.user,
    });
  }
  res.send(rez);
};

const DeleteJog = async function (req, res) {
  if (req.cookies.type == "user" || req.cookies.type == "admin") {
    const rez = await timeJog.findByIdAndDelete({
      _id: req.body.id,
    });
    if (rez) res.send("Record has been deleted successfully");
    else res.send("Record Not Found");
  } else res.send("Sorry you haven't permission to delete time jog");
};

const EditJog = async function (req, res) {
  if (req.cookies.type == "user" || req.cookies.type == "admin") {
    const rez = await timeJog.findByIdAndUpdate(req.body.id, {
      distance: req.body.distance,
      date: req.body.date,
      time: req.body.time,
    });
    if (rez) res.send("Record has been Edited successfully");
    else res.send("Record Not Found");
  } else res.send("Sorry you have no permission to edit time jogs");
};

const FilterdJogs = async function (req, res) {
  const start = req.body.start;
  const end = req.body.end;
  let rez = "";
  if (req.cookies.type == "admin") {
    rez = await timeJog.find({
      date: {
        $gte: new Date(start),
        $lt: new Date(end),
      },
    });
  } else {
    rez = await timeJog.find({
      user: req.cookies.user,
      date: {
        $gte: new Date(start),
        $lt: new Date(end),
      },
    });
  }

  res.send(rez);
};

const CreateUser = async function (req, res) {
  // User manager create user option as manager can create only original type of users.

  if (req.cookies.type == "manager") {
    const rez = await User.findOne({
      email: req.body.email,
    });
    if (rez) res.send("Sorry This User already exists");
    else {
      const user = new User({
        email: req.body.email,
        password: md5(req.body.password),
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
      });
      try {
        const saved = await user.save();
        res.send({ user: user._id });
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }

  // Admin User Create option as admin can create any type of users.
  else if (req.cookies.type == "admin") {
    const rez = await User.findOne({
      email: req.body.email,
    });
    if (rez) res.send("Sorry This User already exists");
    else {
      const user = new User({
        email: req.body.email,
        password: md5(req.body.password),
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        type: req.body.type,
      });
      try {
        const saved = await user.save();
        res.send({ user: user._id });
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
};

const EditUSer = async function (req, res) {
  // User manager edit user option as manager can edit only original type of users.

  if (req.cookies.type == "manager") {
    const rez = await User.findOne({
      email: req.body.email,
    });
    if ((rez && rez.type == "user") || rez._id == req.cookies.user) {
      await User.findByIdAndUpdate(rez._id, {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        password: md5(req.body.password),
      });
      res.send("User has been edited successfully");
    } else if (rez && rez.type != "user")
      res.send("Sorry you cannot edit this user, please ask the admin.");
    else res.send("User Not Found");
  }
  // Admin User edit option as admin can edit any type of users.
  else if (req.cookies.type == "admin") {
    const rez = await User.findOne({
      email: req.body.email,
    });
    if (rez) {
      await User.findByIdAndUpdate(rez._id, {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        password: md5(req.body.password),
      });
      res.send("User has been edited successfully");
    } else res.send("User Not Found");
  }
};

const GetUsers = async function (req, res) {
  if (req.cookies.type == "manager") {
    const rez = await User.find({ type: "user" });
    res.send(rez);
  } else if (req.cookies.type == "admin") {
    const rez = await User.find();
    res.send(rez);
  }
};

const DeleteUser = async function (req, res) {
  const rez = await User.findOne({ email: req.body.email });
  if (req.cookies.type == "manager") {
    const type = "user";
    if (rez && rez.type == "user") {
      await User.findByIdAndDelete(rez._id);
      res.send("User has been deleted successfully");
    } else if (rez && rez.type != "user")
      res.send("Sorry you cannot delete this user, Please ask your admin");
    else res.send("User isn't found");
  } else if (req.cookies.type == "admin") {
    if (rez) {
      await User.findByIdAndDelete(rez._id);
      res.send("User has been deleted successfully");
    } else res.send("User isn't found");
  }
};

const week = async function weekCount(req, res) {
  let date = new Date(req.body.date);
  let date2 = new Date(date.setDate(date.getDate() + 7));
  let total_distance = 0;
  let total_time = 0;
  let avg_speed = 0;
  rez = await timeJog.find({
    user: req.cookies.user,
    date: {
      $gte: new Date(req.body.date),
      $lt: date2,
    },
  });
  rez.forEach((element) => {
    total_distance += element["distance"];
    total_time += element["time"];
  });
  avg_speed = total_distance / total_time;
  res.send(
    "Total Distance: " +
      total_distance +
      "\n Totla Time: " +
      total_time +
      "\n Avg Speed: " +
      avg_speed
  );
};
module.exports = {
  Register,
  Login,
  Logout,
  AddTimeJog,
  getJogs,
  DeleteJog,
  EditJog,
  EditUSer,
  CreateUser,
  GetUsers,
  DeleteUser,
  FilterdJogs,
  week,
};
