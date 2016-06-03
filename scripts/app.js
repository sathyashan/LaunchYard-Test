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
        if(!updatedList.length){
            $(".addButton").removeClass("hideContent");
        }
        if(updatedList.length >= 1){
            $(".addButton").addClass("hideContent");
        }
    },

    componentWillMount: function () {
        this.serverRequest = $.get("http://launchyard.com/js/sample.json",
            function (data) {
                console.log(data);
                data = sortByName(data);
                this.setState({
                    initialItems: data,
                    items: data
                });

            }.bind(this))
            .fail(function(){
                this.setState({msg:'unable to get data'});
            }.bind(this));
    },
    componentDidMount: function () {
        //show content after getting data
        $(".app").removeClass("hideContent");
    },
    addList: function () {
        $(".mainContent").removeClass("hideContent")
            .addClass("hideContent");
        $(".newEmployeeForm").removeClass("hideContent");
    },
    saveInList: function () {
        var name = $(".newName").val(),
            designation = $(".newDesignation").val(),
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
            
            var newItem = {name: name, designation: designation, avatar: avatar};
            //add the item in the determined position
            initialLisItems[pos] = newItem;

            this.setState({
                items: initialLisItems,
                initialItems: initialLisItems,
                msg: 'Saved Successfully'
            });

            $(".newName").val("");
            $(".newDesignation").val("");
            $(".addButton").addClass("hideContent");
            $(".newEmployeeForm").addClass("hideContent");
            $(".mainContent").removeClass("hideContent");
        }

        $(".toastMessageBox").removeClass("hideContent");
        //Toast the message for only 2 seconds
        setTimeout(function () {
            $(".toastMessageBox").addClass("hideContent");
        }, 2000);
    },
    backToHome: function () {
        //reset all
        $(".newName").val("");
        $(".newDesignation").val("");
        $(".addButton").addClass("hideContent");
        $(".newEmployeeForm").addClass("hideContent");
        $(".mainContent").removeClass("hideContent");
    },
    render: function () {
        return (
            <div className="app hideContent">
                <div className="mainContent">
                    <div className="searchBoxRow" >
                        <input className="searchInput" type= "text" placeholder= "search.." onChange={this.filterList} />
                    </div>
                    <ListItems listItems={this.state.items} />
                    <div className="addButton centered hideContent"><a className="btnAdd" onClick={this.addList}>ADD NEW</a></div>
                </div>
                <div className="hideContent centered newEmployeeForm">
                    <div> <input className="newName" placeholder="Employee Name" /> </div>
                    <div> <input className="newDesignation" placeholder="Designation" /> </div>
                    <a className="btnSave" onClick={this.saveInList}>SAVE</a>
                    <a className="btnBack" onClick={this.backToHome}>BACK</a>
                </div>
                <div className="hideContent toastMessageBox clearfix"><div className="toast">{this.state.msg}</div></div>
            </div>
        );
    }
});

ReactDOM.render(<EmployeeList />, document.getElementById("appContent"));