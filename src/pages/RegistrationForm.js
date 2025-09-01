"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  MenuItem,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff, Refresh } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from 'react-router-dom';

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [orgName, SetOrgName] =useState("");
  const [orgPic, SetOrgPic] =useState("");
  const [orgId, SetOrgId] =useState("");
const API_URL = process.env.REACT_APP_API_URL;

 const [captcha, setCaptcha] = useState("");
const { id } = useParams();

// Captcha generator
const handleRefreshCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid confusing chars
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  setCaptcha(result);
};

useEffect(() => {
  handleRefreshCaptcha(); // generate captcha when component mounts
}, []);

useEffect(() => {

    const fetchOrgDetails = async () => {
    // Replace this with your actual API call
    const response = await fetch(`${API_URL}org-details`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            id:id
      }),

      
    });
     const data = await response.json();
     SetOrgName(data.data.org_name)
     SetOrgPic(data.data.logo)
     SetOrgId(data.data.id)

}
  fetchOrgDetails(); // generate captcha when component mounts
}, []);

  // ✅ Validation Schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain an uppercase letter")
      .matches(/[a-z]/, "Must contain a lowercase letter")
      .matches(/[0-9]/, "Must contain a number")
      .matches(/[@$!%*?&]/, "Must contain a special character"),
    phone: Yup.string()
      .nullable()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .notRequired(),
    maritalStatus: Yup.string().required("Marital status is required"),
captchaInput: Yup.string()
  .required("Captcha is required")
  .test("captcha-match", "Captcha does not match", function (value) {
    return value === captcha; // exact match, case-sensitive
  }),

  });

  // ✅ Formik
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      maritalStatus: "",
      captchaInput: "",
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    context: { captcha }, // 👈 Captcha for Yup
    enableReinitialize: true, // refreshes context on captcha change
    onSubmit: async(values) => {
      console.log("Form Data:", values);

       const response = await fetch(`${API_URL}update-home-settings`, {
        method: 'POST',

    });

    if (response.ok) {
        alert("Settings saved successfully!");
    } else {
        const errorData = await response.json();
        alert(`Error saving settings: ${errorData.message}`);
    }

    },
  });


  

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        bgcolor: "#09232C",
        p: 4,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: "100%" }} elevation={3}>
        <Box textAlign="center" mb={3}>
          <img
            src={orgPic}
            alt="Logo"
            style={{ width: 100, height: "auto", marginBottom: 10 }}
          />
          <Typography variant="h5" gutterBottom>
           {orgName}
          </Typography>
          <Typography variant="subtitle1">User Registration</Typography>
        </Box>
   <form onSubmit={formik.handleSubmit}>
    <Grid container spacing={2}>
  {/* First & Last Name */}
  <Grid size={{ xs: 12, sm: 6 }}>
   <TextField
                label="First Name"
                name="firstName"
                fullWidth
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
  </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>

  {/* Email & Password */}
  <Grid size={{ xs: 12, sm: 6 }}>
    <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
  </Grid>
  <Grid size={{ xs: 12, sm: 6 }}>
   <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
  </Grid>

  {/* Gender & Baptized */}
  <Grid size={{ xs: 12, sm: 6 }}>
    <FormLabel>Gender</FormLabel>
    <RadioGroup row defaultValue="male">
      <FormControlLabel value="male" control={<Radio />} label="Male" />
      <FormControlLabel value="female" control={<Radio />} label="Female" />
    </RadioGroup>
  </Grid>
  <Grid size={{ xs: 12, sm: 6 }}>
    <FormLabel>Baptized</FormLabel>
    <RadioGroup row defaultValue="yes">
      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
      <FormControlLabel value="no" control={<Radio />} label="No" />
    </RadioGroup>
  </Grid>

  {/* Country & Phone */}
  <Grid size={{ xs: 12, sm: 6 }}>
    <TextField select label="Country" fullWidth defaultValue="India">
      <MenuItem value="India">India</MenuItem>
      <MenuItem value="USA">USA</MenuItem>
      <MenuItem value="UK">UK</MenuItem>
    </TextField>
  </Grid>
  <Grid size={{ xs: 12, sm: 6 }}>
    <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
  </Grid>

  {/* DOB & Marital Status */}
  <Grid size={{ xs: 12, sm: 6 }}>
    <TextField
      label="Date of Birth"
      type="date"
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
  </Grid>
  <Grid size={{ xs: 12, sm: 6 }}>
   <FormControl fullWidth>
  <InputLabel id="marital-status-label">Marital Status</InputLabel>
  <Select
    labelId="marital-status-label"
    name="maritalStatus"
    value={formik.values.maritalStatus}  // ✅ will be "" initially
    onChange={formik.handleChange}
  >
    <MenuItem value="">Select</MenuItem>
    <MenuItem value="single">Single</MenuItem>
    <MenuItem value="married">Married</MenuItem>
    <MenuItem value="widowed">Widowed</MenuItem>
  </Select>
  {formik.touched.maritalStatus && formik.errors.maritalStatus && (
    <FormHelperText error>{formik.errors.maritalStatus}</FormHelperText>
  )}
</FormControl>

  </Grid>

  {/* Address */}
  <Grid size={{ xs: 12}}>
    <TextField label="Address" fullWidth multiline rows={3} />
  </Grid>

  {/* Profile Pic */}
  <Grid size={{ xs: 12}}>
    <Button variant="outlined" component="label" fullWidth>
      Upload Profile Pic
      <input type="file" hidden />
    </Button>
  </Grid>

  {/* Captcha + Refresh */}
<Grid size={{ xs: 8, sm: 9 }}>
  <TextField
    label="Captcha"
    name="captchaInput"
    fullWidth
    value={formik.values.captchaInput}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.captchaInput && Boolean(formik.errors.captchaInput)}
    helperText={formik.touched.captchaInput && formik.errors.captchaInput}
  />
</Grid>

  <Grid size={{ xs: 4, sm: 3 }}>
    <Button
      onClick={handleRefreshCaptcha}
      variant="contained"
      fullWidth
      sx={{ height: "70%" }}
    >
      <Refresh fontSize="small" />
    </Button>
  </Grid>

  {/* Captcha Preview */}
  <Grid size={{ xs: 12}}>
    <Box
      p={1}
      sx={{
        border: "1px solid #ccc",
        display: "inline-block",
        fontWeight: "bold",
        letterSpacing: 2,
      }}
    >
      {captcha}
    </Box>
  </Grid>

  {/* Submit Button */}
  <Grid size={{ xs: 12 }}>
    <Button type="submit" variant="contained" fullWidth>
      Register
    </Button>
  </Grid>
</Grid>
</form>

      </Paper>
    </Box>
  );
};

export default RegistrationForm;
