import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationServices from "../Services/AuthenticationServices";
import { Avatar } from "@mui/material";
import { Stack } from "@mui/material";
import ProfilePic from "../Assets/Profile.png";
import WcIcon from "@mui/icons-material/Wc";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { blue, red } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Footer from "../Components/Footer";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileC = () => {
  const navigate = useNavigate();
  const [user, SetUser] = useState();
  const [clientId, setclientId] = useState("");
  const [clientDetails, setclientDetails] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dataFromLocalStorage = localStorage.getItem("loggedUser");
    const parseData = JSON.parse(dataFromLocalStorage);
    const userIdFromData = parseData?.userId;
    setclientId(userIdFromData);
    console.log(clientId);
  }, []);

  useEffect(() => {
    async function fetchclientDetails() {
      setLoading(true);
      try {
        const response = await AuthenticationServices.GetClientDetails(
          clientId
        );
        if (response.data.code == "00") {
          setclientDetails(response.data.content);
          console.log(response.data.content);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    if (clientId) {
      fetchclientDetails();
    }
  }, [clientId]);

  //  Edit Profile
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [type, setType] = React.useState("");
  const [district, setDistrict] = React.useState("");

  const handleChangeT = (event) => {
    setType(event.target.value);
  };
  const handleChangeD = (event) => {
    setDistrict(event.target.value);
  };

  //   Update Profile
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    // email: "",
    gender: "",
    contact_num: "",
  });

  //handle form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const user = {
      clientID: clientDetails.clientID,
      firstName: data.firstName,
      lastName: data.lastName,
      email: clientDetails.email,
      gender: data.gender,
      contactNum: data.contact_num,
      password: clientDetails.password,
    };
    console.log(user);
    try {
      const result = await AuthenticationServices.UpdateClient(user);
      console.log(result);
      if (result.data.code === "00") {
        console.log(result.data.content);
        toast.success("Your Details have been changed successfully!");
        setTimeout(async () => {
          setOpen(false);
          window.location.reload();
        }, 4000);
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete Account
  const [openD, setOpenD] = React.useState(false);

  const handleClickOpenD = () => {
    setOpenD(true);
  };

  const handleCloseD = () => {
    setOpenD(false);
  };

  const DeleteUser = async () => {
    try {
      console.log(clientId);
      const response = await AuthenticationServices.DeleteClient(clientId);
      if (response.data.code == "00") {
        toast.success("Your Account has been Deleted Successfully");
        localStorage.removeItem("loggedUser");
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else {
        toast.error("An Error Occurred While Deleting Your Account");
      }
    } catch (error) {
      console.log(error);
      toast.error("An Error Occurred While Deleting Your Account");
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-white md:pt-10">
        <h1 className="flex items-center justify-center text-5xl font-bold text-blue-600 md:text-6xl">
          My Account
        </h1>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : clientDetails ? (
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col">
                <div className="relative flex items-center justify-center">
                  <img src={ProfilePic} alt="" className="w-5/12" />
                </div>
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                  <h1 className="flex text-4xl font-bold text-gray-800 md:text-7xl">
                    {clientDetails.firstName}
                  </h1>
                  <h1 className="flex items-center justify-center text-4xl text-gray-800 md:text-5xl md:pt-5">
                    {clientDetails.lastName}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col w-full pt-10 md:pr-24">
                <div className="items-start justify-start p-4 md:py-10 md:pr-40">
                  <ul className="w-full p-10 text-black bg-white shadow-md md:py-10 md:p-0 md:px-40 rounded-box">
                    <li className="py-3">
                      <div className="flex flex-row gap-8">
                        <Avatar sx={{ bgcolor: blue[600] }}>
                          <CallIcon />
                        </Avatar>
                        <li>
                          <a className="text-xl text-gray-700 md:text-2xl">
                            {clientDetails.contactNum}
                          </a>
                        </li>
                      </div>
                    </li>
                    <li className="py-3">
                      <div className="flex flex-row gap-8">
                        <Avatar sx={{ bgcolor: blue[600] }}>
                          <WcIcon />
                        </Avatar>
                        <li>
                          <a className="text-xl text-gray-700 md:text-2xl">
                            {clientDetails.gender}
                          </a>
                        </li>
                      </div>
                    </li>
                    <li className="py-3">
                      <div className="flex flex-row gap-8">
                        <Avatar sx={{ bgcolor: blue[600] }}>
                          <EmailIcon />
                        </Avatar>
                        <li>
                          <a className="text-xl text-gray-700 md:text-2xl">
                            {clientDetails.email}
                          </a>
                        </li>
                      </div>
                    </li>
                    {/* <li className="py-3">
                      <div className="flex flex-row gap-8">
                        <Avatar sx={{ bgcolor: blue[600] }}>
                          <PlaceIcon />
                        </Avatar>
                        <li>
                          <a className="text-xl text-gray-700 md:text-2xl">
                            {salonDetials.district}
                          </a>
                        </li>
                      </div>
                    </li> */}
                  </ul>
                </div>
                {/* Dialog */}
                <div className="flex flex-col items-center justify-center gap-4 p-10 md:justify-between md:flex-row md:pt-12">
                  <button
                    onClick={handleClickOpen}
                    className="px-20 bg-blue-600 md:ml-20 btn btn-accent hover:bg-blue-700"
                    type="submit">
                    Edit Profile
                  </button>
                  <button
                    onClick={handleClickOpenD}
                    className="px-16 bg-red-600 md:mr-56 btn btn-accent hover:bg-red-700"
                    type="submit">
                    Delete Account
                  </button>
                  <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">
                      {"Edit Profile"}
                    </DialogTitle>
                    <DialogContent>
                      <form
                        action=""
                        className="flex flex-col gap-4 p-2"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-5">
                          <TextField
                            name="firstName"
                            required
                            id="outlined-required"
                            label="First Name"
                            defaultValue={clientDetails.firstName}
                            {...register("firstName", {
                              required: true,
                            })}
                          />

                          <TextField
                            name="lastName"
                            required
                            id="outlined-required"
                            label="Last Name"
                            defaultValue={clientDetails.lastName}
                            {...register("lastName", {
                              required: true,
                            })}
                          />

                          <TextField
                            name="contact_num"
                            required
                            id="outlined-required"
                            label="Contact Number"
                            defaultValue={clientDetails.contactNum}
                            {...register("contact_num", {
                              required: true,
                              maxLength: 10,
                              minLength: 10,
                              pattern: /^[0-9]+$/,
                            })}
                          />
                          {errors.contact_num && (
                            <p className="text-red-600">
                              Invalid Mobile Number
                            </p>
                          )}

                          <select
                            className="w-full p-2 text-lg bg-white border-2 border-gray-300 select select-bordered"
                            type="text"
                            name="gender"
                            defaultValue={clientDetails.gender}
                            {...register("gender", {
                              required: true,
                            })}>
                            <option disabled selected>
                              Please choose your Gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          {errors.type && (
                            <p className="text-red-600">
                              Please select your salon type
                            </p>
                          )}
                        </div>
                        <div>
                          <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                              Cansle
                            </Button>
                            <Button variant="contained" type="submit" autoFocus>
                              Save Changes
                            </Button>
                          </DialogActions>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={openD}
                    onClose={handleCloseD}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                      {"Confirm Delete"}
                    </DialogTitle>
                    <div className="flex items-center justify-center">
                      <DeleteOutlineIcon
                        style={{ fontSize: 40, color: red[600] }}
                      />
                    </div>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure to delete this account?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseD}>Cansle</Button>
                      <Button
                        // variant="outlined"
                        onClick={DeleteUser}
                        sx={{ color: red[600] }}>
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
            </div>
          ) : (
            <p>No client details found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileC;
