/// <reference path="C:\Users\Sathyamoorthy\Desktop\react.d.ts" />
var sortByName = function (data) {
    for (var i = 0; i < data.length; i++) {
        for (var j = i + 1; j < data.length; j++) {
            //compare the name of the object and sort accordingly
            if (data[i].name.toLowerCase() > data[j].name.toLowerCase()) {
                var tempObj = data[i];
                data[i] = data[j];
                data[j] = tempObj;
            }
        }
    }
    return data;
};

/* params
   refElementId- Id of the element for which new class name will be added
   className- name of the class 
*/
var addClass = function (refElementId, className) {
    document.getElementById(refElementId).classList.add(className);
};

/* params
   refElementId- Id of the element for which class name (className) will be removed
   className- name of the class 
*/
var removeClass = function (refElementId, className) {
    document.getElementById(refElementId).classList.remove(className);
};

var showToastMessage = function name() {
    removeClass("toastMessageBox", "hideContent");
    //Toast the message for only 2 seconds
    setTimeout(function () {
        addClass("toastMessageBox", "hideContent");
    }, 2000);
};

/* params
    url - url to get the data
*/
var httpGet = function (url) {
    var promise = new Promise(function (sucessCallBack, failureCallBack) {
        var client = new XMLHttpRequest();
        client.open("GET", url);
        client.send();
        client.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                sucessCallBack(this.response);
            } else {
                failureCallBack(this.statusText);
            }
        };
        client.onerror = function () {
            failureCallBack(this.statusText);
        };
    });

    return promise;
}

var ListItems = React.createClass({
    render: function () {
        return (
            <ul className="employeesList margin0 padding0">
                {
                    this.props.listItems.map(function (item) {
                        return <li className="clearfix">
                            <img className="avatar" src={item.avatar}/>
                            <div className="name">{item.name}</div>
                            <div className="designation">{item.designation}</div>
                        </li>
                    })
                }
            </ul>
        )
    }
})
var EmployeeList = React.createClass({
    getInitialState: function () {
        return {
            initialItems: [],
            items: [],
            msg: ''
        }
    },
    filterList: function (event) {
        var updatedList = [];
        updatedList = this.state.initialItems.filter(function (item) {
            return item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });

        //re-render the list
        this.setState({ items: updatedList });

        //conditions for showing add button
        if (!updatedList.length) {
            removeClass("addButton", "hideContent");
        }
        if (updatedList.length >= 1) {
            addClass("addButton", "hideContent");
        }
    },

    componentWillMount: function () {
        //following object defines the callback functions which to be passed in promise
        var callBack = {
            success: function (data) {
                data = JSON.parse(data);
                data = sortByName(data);
                console.log(data);
                this.setState({
                    initialItems: data,
                    items: data
                });
            },
            fail: function () {
                this.setState({ msg: 'unable to get data' });
                showToastMessage();
            } 
        };
        
        httpGet("http://launchyard.com/js/sample.json")
            .then(callBack.success.bind(this))
            .catch(callBack.fail.bind(this));
    },
    componentDidMount: function () {
        //show content after getting data
        removeClass("app", "hideContent");
    },
    addList: function () {
        addClass("mainContent", "hideContent");
        removeClass("newEmployeeForm", "hideContent");
        document.getElementsByClassName("searchInput")[0].value = "";
    },
    saveInList: function () {
        var name = document.getElementsByClassName("newName")[0].value,
            designation = document.getElementsByClassName("newDesignation")[0].value,
            avatar = "http://coenraets.org/apps/angular-directory/pics/james_king.jpg";//using the same image

        //check for field emptiness
        if (!name) {
            this.setState({ msg: 'Fields should not be empty' });
        }
        else if (!designation) {
            this.setState({ msg: 'Fields should not be empty' });
        }
        //valid input
        else {
            //insert the new item in the existing list and place it in order
            var initialLisItems = this.state.initialItems,
                pos = initialLisItems.length;
            //find the position to insert the new item
            for (var i = 0; i < initialLisItems.length; i++) {
                if (name.toLowerCase() < initialLisItems[i].name.toLowerCase()) {
                    pos = i;
                    break;
                }
            }
            //shift List item position
            if (pos !== initialLisItems.length) {
                initialLisItems.push(initialLisItems[initialLisItems.length - 1]);
                for (var i = initialLisItems.length - 1; i > pos; i--) {
                    initialLisItems[i] = initialLisItems[i - 1];
                }
            }

            var newItem = { name: name, designation: designation, avatar: avatar };
            //add the item in the determined position
            initialLisItems[pos] = newItem;

            this.setState({
                items: initialLisItems,
                initialItems: initialLisItems,
                msg: 'Saved Successfully'
            });

            document.getElementsByClassName("newName")[0].value = "";
            document.getElementsByClassName("newDesignation")[0].value = "";
            addClass("addButton", "hideContent");
            addClass("newEmployeeForm", "hideContent");
            removeClass("mainContent", "hideContent");
        }

        showToastMessage();
    },
    backToHome: function () {
        //reset all
        document.getElementsByClassName("searchInput")[0].value = "";
        this.setState({ items: this.state.initialItems });
        document.getElementsByClassName("newName")[0].value = "";
        document.getElementsByClassName("newDesignation")[0].value = "";
        addClass("addButton", "hideContent");
        addClass("newEmployeeForm", "hideContent");
        removeClass("mainContent", "hideContent");
    },
    render: function () {
        return (
            <div className="app hideContent" id="app">
                <div className="mainContent" id="mainContent">
                    <div className="searchBoxRow">
                        <input className="searchInput" id="searchInput" type= "text" placeholder= "search.." onChange={this.filterList} />
                    </div>
                    <ListItems listItems={this.state.items} />
                    <div className="addButton centered hideContent" id="addButton"><a className="btnAdd" onClick={this.addList}>ADD NEW</a></div>
                </div>
                <div className="hideContent centered newEmployeeForm" id="newEmployeeForm">
                    <div> <input className="newName" placeholder="Employee Name" /> </div>
                    <div> <input className="newDesignation" placeholder="Designation" /> </div>
                    <a className="btnSave" onClick={this.saveInList}>SAVE</a>
                    <a className="btnBack" onClick={this.backToHome}>BACK</a>
                </div>
                <div className="hideContent toastMessageBox clearfix" id="toastMessageBox"><div className="toast">{this.state.msg}</div></div>
            </div>
        );
    }
});

ReactDOM.render(<EmployeeList />, document.getElementById("appContent"));