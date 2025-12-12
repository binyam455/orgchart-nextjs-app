import React, { useState } from "react"
import { set, useForm } from "react-hook-form"
import Modal from "./Modal"
import styles from "./OrgChartNode.module.css"

type FormValues = {
    name: string;
    description: string;
    manager_id: number;
    manager_selid: string;
};

type OptionType = {
    key: string;
    value: string;
}

const OrgChartNode = (props: any) => {
    const [selectedNode, setSelectedNode] = useState({
                                                id: 0, 
                                                name:"", 
                                                description:"",
                                                manager_id: 0,
                                                manager_name: "",
                                                level: 0,
                                                path: ""
                                            });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isConfDelModalOpen, setIsConfDelModalOpen] = useState(false);
    const [actionType, setActionType] = useState("");
    const [addEditBtnVal, setAddEditBtnVal] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [addEditManagerName, setAddEditManagerName] = useState("");
    const [showManager, setShowManager] = useState(false);
    const [managerList, setManagerList] = useState<OptionType[]>([])
    const [frmTitle, setFrmTitle] = useState("");
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();

    const handleOpenAddModal = (selNode: any) => {
        assignSelNode(selNode);
        setActionType("add");
        setFrmTitle("Add Node");
        setAddEditBtnVal("Add");
        setAddEditManagerName(selNode.name);
        setShowManager(true);

        let managerListArr: any[] = [];
        managerListArr.push({ key: "-1", value: "-- Root --"});
        setManagerList(managerListArr);
        setSelectedOption("-1");

        setValue("name", "");
        setValue("description", "");
        setValue("manager_selid", "-1");
        setIsAddModalOpen(true);
    }

    const handleOpenEditModal = (selNode: any) => {
        assignSelNode(selNode);
        setActionType("edit");
        setFrmTitle("Edit Node");
        setAddEditBtnVal("Update");
        setAddEditManagerName("");
        setShowManager(false);
        
        let managerListArr: any[] = [];
        setSelectedOption("");
        if (selNode.manager_id == 0) {
            managerListArr.push({ key: "-1", value: "-- Root --"});
        }
        else {
            for (const [key, value] of props.datamap) {
console.log("p=" + value.path + ", n=" + selNode.name);
break;
                if (value.manager_id == 0 ||
                    (key != selNode.id && 
                    !value.path.includes(selNode.name))) 
                    managerListArr.push({ key: key, value: value.name});
            
                if (key == selNode.manager_id)
                    setSelectedOption(key);
            }

            if (selNode.manager_id == "-1")
                setSelectedOption(selNode.id);
        }

        setManagerList(managerListArr);

        setValue("name", selNode.name, { shouldValidate: true});
        setValue("description", selNode.description, { shouldValidate: true})
        setIsAddModalOpen(true);
    }

    const handleOpenInfoModal = (selNode: any) => {
        assignSelNode(selNode);
        setIsInfoModalOpen(true); 
    }

    const handleOpenConfDelModal = (selNode: any) => {
        assignSelNode(selNode);
        setIsConfDelModalOpen(true); 
    }

    const assignSelNode = (selNode: any) => {
        let manager_name = "-- Root --";
        if (selNode.manager_id != 0)
            manager_name = props.datamap.get(selNode.manager_id).name;
        setSelectedNode({ 
                         id: selNode.id, 
                         name: selNode.name, 
                         description: selNode.description,
                         manager_id: selNode.manager_id,
                         manager_name: manager_name,
                         level: selNode.level,
                         path: selNode.path
                        });  
    }

    const handleCloseAddModal = () => setIsAddModalOpen(false);
    const handleCloseInfoModal = () => setIsInfoModalOpen(false);
    const handleCloseConfDelModal = () => setIsConfDelModalOpen(false);
    
    const handleMngrChg = (event: any) => setSelectedOption(event.target.value);

    const onSubmit = async (vals: any) => {
        if  (actionType == "add") 
            vals.manager_id = selectedNode.id;
        else {
            if (vals.manager_selid == "-1")
                vals.manager_selid = 0;
        }

        let method = "POST";
        let url = "http://localhost:5000/orgchart";
        if (actionType == "edit") {
            method = "PUT";
            url += "/" + selectedNode.id;
        }

        const response = await fetch(url,
                    {
                        method: method,
                        headers: {
                           "Content-Type": "application/json", 
                        },
                        body: JSON.stringify(vals)
                    });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        setIsAddModalOpen(false);
        props.loaddata();
    }

    const handleDeleteNode = async (selNode: any) => {
        const response = await fetch("http://localhost:5000/orgchart/" + selNode.id,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        setIsConfDelModalOpen(false);
        props.loaddata();
    }
    
    return(
        <div>
            <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
                <h2>{frmTitle}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <table>
                        <tbody>
                            <tr>
                                <td> 
                                    <label className={styles.frmlbl}>Manager</label>
                                </td>
                                <td>
                                    <label className={`${showManager ? styles.dispElem : styles.hideElem}`}>
                                        {addEditManagerName}
                                    </label>
                                    <select value={selectedOption} 
                                     className={`${showManager ?  styles.hideElem : styles.dispElem}`}
                                    {...register("manager_selid", { required: "Manager is required",
                                                                    onChange: handleMngrChg })
                                    }>   
                                        {managerList.map((option:OptionType) => (
                                            <option key={option.key} value={option.key}>
                                                {option.value}
                                            </option>

                                        ))}
                                    </select>
                                    <br/>
                                    <label className={styles.suberror}>
                                        {errors.manager_selid && errors.manager_selid.message}
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={styles.frmlbl}>Name</label>
                                </td>
                                <td>
                                    <input type="text" 
                                    {...register("name", { required: "Name is required" })} />
                                    <br/>
                                    <label className={styles.suberror}>
                                        {errors.name && errors.name.message}
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className={styles.frmlbl}>Description</label>
                                </td>
                                <td>
                                    <input type="text" size={35} 
                                    {...register("description", { required: "Description is required" })} />
                                    <br/>
                                    <label className={styles.suberror}>
                                        {errors.description && errors.description.message}
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className={styles.subbtncell}>
                                    <input className={styles.subbtn} type="submit" value={addEditBtnVal} />
                                    <input type="hidden" 
                                    {...register("manager_id") }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>                
                </form>
            </Modal>

            <Modal isOpen={isInfoModalOpen} onClose={handleCloseInfoModal}>
                <h2>Node Info</h2>
                <table className={styles.nodeinfotbl}>
                  <tbody>
                    <tr>
                        <td className={styles.infocell}><label className={styles.frmlbl}>Name</label></td>
                        <td>{selectedNode.name}</td>
                    </tr>
                    <tr>
                        <td><label className={styles.frmlbl}>Description</label></td>
                        <td>{selectedNode.description}</td>
                    </tr>
                    <tr>
                        <td><label className={styles.frmlbl}>Manager</label></td>
                        <td>{selectedNode.manager_name}</td>
                    </tr>
                  </tbody>
                </table>
            </Modal>

            <Modal isOpen={isConfDelModalOpen} onClose={handleCloseConfDelModal}>
                <h2>Delete Confirmation</h2>
                <table>
                  <tbody>
                    <tr>
                        <td>
                            Are you sure you want to delete this node (Name={selectedNode.name })?
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.subbtncell}>
                            <input type="button" className={styles.subbtn} value="OK" onClick={() => { handleDeleteNode(selectedNode)}} />                            
                            &nbsp; &nbsp;&nbsp; &nbsp;
                            <input type="button" className={styles.subbtn} value="No" onClick={ handleCloseConfDelModal } />                            
                        </td>
                    </tr>
                  </tbody>
                </table>
            </Modal>
 
            { props.orgchart.map( (chartnode: any) => (
            <table  key={chartnode.id} className={styles.orgnode}>
            <tbody>
                <tr>
                    <td className={styles.orgleft}>
                        <img src="horiz.png" />
                    </td>
                    <td>
                        <div className={styles.orgnodebg}>
                            <div className={styles.orgicon}>
                                <img src="add_icon.png" onClick={ () => { handleOpenAddModal(chartnode) } }/>
                                &nbsp;
                                <img src="edit_icon.png" onClick={ () => { handleOpenEditModal(chartnode) } }/>
                                &nbsp;
                                <img src="delete_icon.png"  onClick={ () => { handleOpenConfDelModal(chartnode) } }/>
                                &nbsp;
                                <img src="info_icon.png" onClick={ () => { handleOpenInfoModal(chartnode) } }/>
                            </div>
                            {chartnode.name} 
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <table className={styles.orgnode2}>
                        <tbody>
                            <tr>
                                <td className={styles.orgleft}>
                                </td>
                                <td>
                                    <OrgChartNode 
                                    orgchart={chartnode.emps} 
                                    loaddata={props.loaddata}
                                    datamap={props.datamap}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table> 
                    </td>
                </tr>
            </tbody>
            </table>
            ))}
            
            </div>
        )
}
export default OrgChartNode;