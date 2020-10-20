import React, {PureComponent, useState, useEffect} from 'react';
import { useDispatch } from "react-redux";
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import {orange, deepPurple, green, red, blue} from '@material-ui/core/colors';
import clsx from 'clsx';
import Proptypes from 'prop-types';
import {useSelector} from 'react-redux';
//import Tooltip from '../../components/Tooltip';
import Tooltip from '@material-ui/core/Tooltip';
import axios from "axios";
import ViewTeam from "../Meeting/Topics/Team";
import { deleteInvitee } from "../../actions/meeting";
import TrashIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AddMemberIcon from '../../add-user.svg'
//TODO: Clean this proof of concept up
const styles = {
    avatar: {
        color: '#fff',
        fontSize: '1.2rem',
    },
    square: {
        borderRadius: 0,
    },
     large: {
        width: 120,
        height: 120
  },
};
const customAvatar = React.forwardRef(({square = false,isProfileImg=false, classes, children, color = "", width=null, fontSize, height=null, opacity, ...props}, ref) => (
    <Avatar ref={ref} style={{backgroundColor: color, position: "inherit", width, height, fontSize, opacity}} variant={square ? "square" : "circle"}
            className={isProfileImg?classes.large: classes.avatar} {...props}>
        {children}
    </Avatar>
));
const CustomAvatar = React.memo(withStyles(styles)(customAvatar));
const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#F5F5F9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #DADDE9',
    },
  }))(Tooltip);
  const BootstrapTooltip=(props)=> {
    const classes = useStylesBootstrap();
  
    return <Tooltip arrow classes={classes} {...props} />;
}
const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
      color: theme.palette.common.black,
    },
    tooltip: {
      backgroundColor: theme.palette.common.black,
    },
  }));
export const UserAvatar = ({organizationID, userID, teamAvatar, meetingInvitees, meetingID, usr, upcomingMeetingAvatar, profile, us, mobileView, updatedAt, disableInteractive, size=false, disableAddIcon, opacity }) => {
    const [errored, setErrored] = useState(false);
    const [erroredArray, setErroredArray] = useState([])
    const users = useSelector(state => state.users.byID) || {};
    const user = users[userID];
    const [open, setOpen] = React.useState(false);
    const globalDispatch = useDispatch();
    let count=0, counter=0, number=0, temp=0;
    let flag = false;
    const toggleModal = (para) => {
        setOpen(para)
    }
    const isAvatarExists = (invitees) => {
        let a = [], count = 0;
        invitees.map(i=>a.push(true))
        invitees.map(async (m,i)=>{
            try{
                const response = await axios.get(`/api/account/${organizationID}/Avatar/${m.userID}`)
                if(response.status === 200){
                    a[i] = false;
                    count++;
                    if(count === invitees.length )
                        setErroredArray(a)
                }
            }
            catch(err){
                a[i] = true;
                count++;
                if(count === invitees.length )
                    setErroredArray(a)
            }
        })
    }

     useEffect(()=>{
         if((teamAvatar&&!open) || upcomingMeetingAvatar) {
            isAvatarExists(meetingInvitees)
         }
        axios.get(`/api/account/${organizationID}/Avatar/${userID}`)
            .then(res => {
                setErrored(false)
            })
            .catch(err=>{
                setErrored(true)
            })
     },[organizationID, userID]);
     const removeInvitee = async removedUserID => {
        try {
          await globalDispatch(deleteInvitee(meetingID, removedUserID));
          isAvatarExists(meetingInvitees.filter(m=>m.userID != removedUserID))
        } catch (err) {
          console.warn(err);
        }
        // setPending(false);
      };
    //   if(meetingInvitees)
        // console.log("meeting invitees", meetingInvitees.length)
      const getRandomColor = ()=> {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    return (
        <React.Fragment>
            {open&&<ViewTeam
                invitees={meetingInvitees}
                organizationID={organizationID}
                users={usr}
                meetingID={meetingID}
                open={open}
                toggleModal={toggleModal}
                updateInvitees={isAvatarExists}
            />}
            {!teamAvatar&& ! profile &&!upcomingMeetingAvatar&&disableInteractive&&<Tooltip  title={user  && `${user.firstName} ${user.lastName}`} placement={'top'}>
                    {errored ? <CustomAvatar color={user && user.color || ''}>{user && user.firstName[0] || ''}</CustomAvatar>
                        : <CustomAvatar src={`/api/account/${organizationID}/Avatar/${userID}?updatedAt=${updatedAt}`}/>}
            </Tooltip>}
            {!teamAvatar&& ! profile &&!upcomingMeetingAvatar&&!disableInteractive&&<Tooltip interactive disableFocusListener disableTouchListener  title={user  && `${user.firstName} ${user.lastName}`} placement={'top'}>
                    {errored ? <CustomAvatar color={user && user.color || ''}  width={size?size:null} height={size?size:null} fontSize={size?10:null}>{user && user.firstName[0] || ''}</CustomAvatar>
                        : <CustomAvatar  width={size?size:null} height={size?size:null} fontSize={size?10:null} src={`/api/account/${organizationID}/Avatar/${userID}?updatedAt=${updatedAt}`}/>}
            </Tooltip>}
            {!teamAvatar && profile &&!upcomingMeetingAvatar&& <div>
                    {errored ? <CustomAvatar color={us[0] && us[0].color || ''} square={true} isProfileImg={true}>{us[0] && us[0].firstName[0] || ''}</CustomAvatar>
                        : <CustomAvatar src={`/api/account/${organizationID}/Avatar/${userID}`} square={true} pro1={true}/>}
            </div>}
            <div style={{display: 'flex', alignItems: 'center'}}>
                {teamAvatar&&!open&&mobileView&&<div>
                    <HtmlTooltip
                        interactive disableFocusListener disableTouchListener
                        title={
                        <React.Fragment>
                            {meetingInvitees.map((m,i) => {
                                return(
                                    <BootstrapTooltip
                                    color="grey"
                                    placement="left"
                                    interactive disableFocusListener disableTouchListener
                                    title={
                                      <React.Fragment>
                                            <div style={{margin: '5px', marginTop: '10px'}}>
                                                <div style={{display: 'flex'}}>
                                                    <span>Invitation</span> 
                                                    <span style={{marginLeft: '20px'}}>{m.requestStatus}</span>   
                                                </div> 
                                                {(m.isAgreed=== false||m.isAgreed===true)&&<div style={{display: 'flex'}}>
                                                    <span>Notes</span> 
                                                    <span style={{marginLeft: '36px'}}>{m.isAgreed?'Yes': 'No'}</span>      
                                                </div>}   
                                            </div>
                                      </React.Fragment>
                                    }
                                  >
                                    <div style={{display: 'flex',justifyContent: 'space-between', marginBottom: '2px'}}>
                                        { erroredArray[i]?<CustomAvatar color={getRandomColor()}>{m && m.userName[0] || ''}</CustomAvatar>
                                        : <CustomAvatar src={`/api/account/${organizationID}/Avatar/${m.userID}`} />}
                                        <p style={{fontSize: '15px'}}>{m.userName}</p>
                                        <div>
                                            <IconButton onClick={() => removeInvitee(m.userID)}>
                                                <TrashIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                  </BootstrapTooltip>
                                )
                            })}
                        </React.Fragment>
                        }
                    >
                        <div style={{background: '#807e7e', borderRadius:'50px', padding: '4px', paddingLeft: 6, paddingRight: 6}}>
                            <GroupAddIcon style={{fontSize: '30px', color: '#fff', width: 15, height: 15}}/>
                        </div>
                    </HtmlTooltip>
                </div>}
                {teamAvatar&&!open&&!mobileView&&<div style={{display: 'flex'}}>
                    {meetingInvitees.map((m,i)=> {
                        if(count <= 2) {
                            count++;
                            return(
                                <HtmlTooltip interactive disableFocusListener disableTouchListener
                                    title={
                                        <div style={{}}>
                                                <div style={{display: 'flex',justifyContent: 'space-between', borderBottom: '1px solid #000', marginBottom: '2px'}}>
                                                    <p style={{fontSize: '15px'}}>{m.userName}</p>
                                                    <div>
                                                        <IconButton onClick={() => removeInvitee(m.userID)}>
                                                            <TrashIcon />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                                <div style={{margin: '5px', marginTop: '10px'}}>
                                                    <div style={{display: 'flex'}}>
                                                        <span>Meeting invitation status</span> 
                                                        <span style={{marginLeft: '20px'}}>{m.requestStatus}</span>   
                                                    </div> 
                                                    {(m.isAgreed=== false||m.isAgreed===true)&&<div style={{display: 'flex'}}>
                                                        <span>Meeting notes agreed</span> 
                                                        <span style={{marginLeft: '36px'}}>{m.isAgreed?'Yes': 'No'}</span>      
                                                    </div>}   
                                                </div>
                                        </div>
                                    }
                                    placement={'bottom'}>
                                { erroredArray[i]?<CustomAvatar  width={size?size:null} height={size?size:null} fontSize={size?10:null} opacity={m.requestStatus == 'Pending'?opacity:null} color={m && m.color}>{m && m.userName?m.userName[0]:m.firstName[0] || ''}</CustomAvatar>
                                : <CustomAvatar  width={size?size:null} height={size?size:null} fontSize={size?10:null} opacity={m.requestStatus == 'Pending'?opacity:null} src={`/api/account/${organizationID}/Avatar/${m.userID}`} />}</HtmlTooltip>

                                )
                        }
                        else {
                            if(flag)
                                return
                            else {
                                flag = true;


                                    return(
                                        <HtmlTooltip interactive disableFocusListener disableTouchListener
                                        title={
                                            <div>
                                                <div style={{width: '200px', overflowY: 'auto', maxHeight: '70vh'}}>
                                                        {meetingInvitees.map((m,i) =>{
                                                            counter++
                                                            if(counter>3) {
                                                                return(
                                                                        <Tooltip
                                                                            interactive disableFocusListener disableTouchListener
                                                                            title={
                                                                                <div style={{margin: '5px', marginTop: '10px'}}>
                                                                                    <div style={{display: 'flex'}}>
                                                                                        <span>Meeting invitation status</span> 
                                                                                        <span style={{marginLeft: '20px'}}>{m.requestStatus}</span>   
                                                                                    </div> 
                                                                                    {(m.isAgreed=== false||m.isAgreed===true)&&<div style={{display: 'flex'}}>
                                                                                        <span>Meeting notes agreed</span> 
                                                                                        <span style={{marginLeft: '36px'}}>{m.isAgreed?'Yes': 'No'}</span>      
                                                                                    </div>}   
                                                                                </div>
                                                                            }
                                                                            placement={'left'}
                                                                        >
                                                                            <div style={{display: 'flex'}}>
                                                                                <div style={{padding: '5px', display: 'flex', alignItems: 'center', width: '150px'}}>
                                                                                    {erroredArray[i] ? <CustomAvatar color={m && m.color}>{m && m.userName[0] || ''}</CustomAvatar>
                                                                                        : <CustomAvatar src={`/api/account/${organizationID}/Avatar/${m.userID}`} />}
                                                                                <span style={{marginLeft: '5px'}}>{m.userName}</span>
                                                                                </div>
                                                                                <div>
                                                                                    <IconButton onClick={() => removeInvitee(m.userID)}>
                                                                                        <TrashIcon />
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                        </Tooltip>
                                                                        
                                                                )
                                                            }
                                                            else {
                                                                return
                                                            }
                                                    })}
                                                </div>
                                                <div style={{textAlign: 'center', padding: '10px', cursor: 'pointer'}} onClick={()=>setOpen(true)}>Invite people</div>
                                            </div>
                                        }
                                        placement={'bottom'}>
                                            <div style={{background: '#807e7e', borderRadius:'50px', padding: '4px', paddingLeft: '6px', paddingRight: '6px'}}>
                                                <GroupAddIcon style={{fontSize: '30px', color: '#fff', width: 15, height: 15}}/>
                                            </div>
                                        </HtmlTooltip>
                                    )
                                
                                
                            }
                        }
                    })}
                </div>}
                {!upcomingMeetingAvatar && !disableAddIcon &&meetingInvitees&&meetingInvitees.length<3&&<div onClick={()=>setOpen(true)} style={{ marginLeft: 5, marginTop: 5}}>
                    <img src={AddMemberIcon} alt="grp icon"  width={size?size:30} />
                </div>}
                </div>
                {upcomingMeetingAvatar&&meetingInvitees&&<div style={{display: 'flex', alignItems: 'center'}}>{meetingInvitees.map((m, i) =>{
                    if(number <= 2) {
                        number++
                        return(
                            <div>
                                {m && m.userName &&
                                <HtmlTooltip
                                    
                                    title={
                                    <React.Fragment>
                                        <div style={{}}>
                                                <div style={{display: 'flex',justifyContent: 'space-between', borderBottom: '1px solid #000', marginBottom: '2px'}}>
                                                    <p style={{fontSize: '11px'}}>{m.userName}</p>
                                                    <div>
                                                        {/* <IconButton onClick={() => removeInvitee(m.userID)}>
                                                            <TrashIcon />
                                                        </IconButton> */}
                                                    </div>
                                                </div>
                                                <div style={{margin: '5px', marginTop: '10px'}}>
                                                    <div style={{display: 'flex'}}>
                                                        <span>Meeting invitation status</span> 
                                                        <span style={{marginLeft: '20px'}}>{m.requestStatus}</span>   
                                                    </div> 
                                                    {(m.isAgreed=== false||m.isAgreed===true)&&<div style={{display: 'flex'}}>
                                                        <span>Meeting notes agreed</span> 
                                                        <span style={{marginLeft: '36px'}}>{m.isAgreed?'Yes': 'No'}</span>      
                                                    </div>}   
                                                </div>
                                        </div>
                                    </React.Fragment>
                                    }
                                >
                                    <div style={{margin: 2}}>
                                         
                                        {erroredArray[i] ? <CustomAvatar color={m && m.color} width="33px" height="33px">{m && m.userName[0] || ''}</CustomAvatar>
                                        : <CustomAvatar src={`/api/account/${organizationID}/Avatar/${m.userID}`} width="33px" height="33px"/>}
                                    </div>
                                </HtmlTooltip>}
                            </div>
                        )
                    }
                    else {
                        temp++
                    }
                })}
                {temp>0 && <HtmlTooltip interactive disableFocusListener disableTouchListener
                                        title={
                                            <div>
                                                <div style={{width: '200px', overflowY: 'auto', maxHeight: '70vh'}}>
                                                        {meetingInvitees.map((m,i) =>{
                                                            counter++
                                                            if(counter>3) {
                                                                return(
                                                                        <Tooltip
                                                                            interactive disableFocusListener disableTouchListener
                                                                            title={
                                                                                <div style={{margin: '5px', marginTop: '10px'}}>
                                                                                    <div style={{display: 'flex'}}>
                                                                                        <span>Meeting invitation status</span> 
                                                                                        <span style={{marginLeft: '20px'}}>{m.requestStatus}</span>   
                                                                                    </div> 
                                                                                    {(m.isAgreed=== false||m.isAgreed===true)&&<div style={{display: 'flex'}}>
                                                                                        <span>Meeting notes agreed</span> 
                                                                                        <span style={{marginLeft: '36px'}}>{m.isAgreed?'Yes': 'No'}</span>      
                                                                                    </div>}   
                                                                                </div>
                                                                            }
                                                                            placement={'left'}
                                                                        >
                                                                            <div style={{display: 'flex'}}>
                                                                                <div style={{padding: '5px', display: 'flex', alignItems: 'center', width: '150px'}}>
                                                                                    {erroredArray[i] ? <CustomAvatar color={m && m.color}>{m && m.userName[0] || ''}</CustomAvatar>
                                                                                        : <CustomAvatar src={`/api/account/${organizationID}/Avatar/${m.userID}`} />}
                                                                                <span style={{marginLeft: '5px'}}>{m.userName}</span>
                                                                                </div>
                                                                                <div>
                                                                                    {/* <IconButton onClick={() => removeInvitee(m.userID)}>
                                                                                        <TrashIcon />
                                                                                    </IconButton> */}
                                                                                </div>
                                                                            </div>
                                                                        </Tooltip>
                                                                        
                                                                )
                                                            }
                                                            else {
                                                                return
                                                            }
                                                    })}
                                                </div>
                                                {/* <div style={{textAlign: 'center', padding: '10px', cursor: 'pointer'}} onClick={()=>setOpen(true)}>Invite people</div> */}
                                            </div>
                                        }
                                        placement={'right'}>
                                            <div style={{background: '#807e7e', borderRadius:'50px', padding: '4px', paddingLeft: '7px', paddingRight: '7px'}}>
                                                {temp>0 && <h3 style={{margin: 0,marginLeft: 5, color: '#fff'}}>+{temp}</h3>}
                                            </div>
                                        </HtmlTooltip>}
                </div>}
        </React.Fragment>
    )
};
UserAvatar.propTypes = {
    organizationID: Proptypes.string.isRequired,
    userID: Proptypes.string.isRequired,
}
export default CustomAvatar;


