const menu = [
    {  
      href: "/panel/review", 
      icon: "faChalkboardUser", 
      title: "Review DACs", 
      description: "Validate DAC info supplied by the DAC-admins.",
      color: "bg-primary" 
    },
    { 
      href: "/panel/create", 
      icon: "faUsersRectangle", 
      title: "Create a DAC", 
      description: "Link users with resources and generate new DACs.",
      color: "bg-success"
    },
    {
      href: "/panel/roles", 
      icon: "faUserShield", 
      title: "Manage DAC roles", 
      description: "Manage roles from existing DACs.",
      color: "bg-danger"
    },
    { 
      href: "/panel/resources", 
      icon: "faFileCircleExclamation", 
      title: "Manage Resources", 
      description: "Manage resources allocated to the DACs.",
      color: "bg-warning"
    }
];

export default menu;
