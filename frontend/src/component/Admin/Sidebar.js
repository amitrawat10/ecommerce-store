import React from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddIcon from "@material-ui/icons/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import RateReviewIcon from "@material-ui/icons/RateReview";
const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});
const Sidebar = () => {
  const classes = useStyles();
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <div className="sidebar-links">
        <Link to="/admin/dashboard">
          <p>
            <DashboardIcon /> Dashboard
          </p>
        </Link>

        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeItem nodeId="1" label="Products">
            <Link to="/admin/products">
              <TreeItem nodeId="2" label="All" icon={<PostAddIcon />} />
            </Link>
            <Link to="/admin/product">
              {" "}
              <TreeItem nodeId="3" label="Create" icon={<AddIcon />} />
            </Link>
          </TreeItem>
        </TreeView>

        <Link to="/admin/orders">
          <p>
            <ListAltIcon />
            Orders
          </p>
        </Link>
        <Link to="/admin/users">
          <p>
            <PeopleIcon /> Users
          </p>
        </Link>
        <Link to="/admin/reviews">
          <p>
            <RateReviewIcon />
            Reviews
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
