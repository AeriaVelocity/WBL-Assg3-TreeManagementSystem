import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState({});
    const [selectedTree, setSelectedTree] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/data');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    function renderLongDateFormat(isoDate) {
        const dateObj = new Date(isoDate);

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const dayOfWeek = daysOfWeek[dateObj.getDay()];
        const dayOfMonth = dateObj.getDate();
        const monthName = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        const longDateFormat = `${dayOfWeek}, ${dayOfMonth} ${monthName} ${year}`;

        return longDateFormat;
    }

    function renderTime(isoDate, useAmPm = true) {
        const dateObj = new Date(isoDate);

        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();

        if (useAmPm) {
            if (hours > 12) {
                return `${hours - 12}:${minutes}:${seconds} PM`;
            }
            else {
                return `${hours}:${minutes}:${seconds} AM`;
            }
        }
        
        return `${hours}:${minutes}:${seconds}`;
    }

    const handleTreeClick = (tree) => {
        setSelectedTree(tree);
    };

    const handleSubmitComment = async (event) => {
        event.preventDefault();

        if (comment.length === 0) {
            console.error('Comment cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    treeId: selectedTree.id,
                    comment: comment,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            // Update selectedTree with new comment
            const updatedTree = { ...selectedTree };
            updatedTree.comments.push({
                comment: comment,
                timestamp: new Date().toISOString(),
            });
            setSelectedTree(updatedTree);

            // Reset comment input
            setComment('');

            console.log('Comment submitted successfully');
        }
        catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const fetchUserComments = () => {
        const comments = selectedTree.comments;
        if (comments.length > 0) {
            var displayedComments = [];
            console.log(displayedComments);
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i].comment;
                var commentDate = comments[i].timestamp;
                displayedComments.push("'" + comment + "'" + " on " + renderLongDateFormat(commentDate) + ", " + renderTime(commentDate, false));
            }
            // Return in reverse order so the most recent comment is first
            return displayedComments.reverse();
        }
        else {
            return ["No comments yet."];
        }
    }

    return (
        <div className="App">
            <div id="header">
                <h1>Tree Management System - Web App</h1>
                <div id="client-info">
                    {data.clientInfo && (
                        <div>
                            <p>Licensed by <a href={data.clientInfo.website}>{data.clientInfo.nameOfBusiness}</a> by {data.clientInfo.mainAdmin}</p>
                            <p>Contact: {data.clientInfo.telephone}</p>
                            <p>Contributors: {data.clientInfo.contributors.join(', ')}</p>
                        </div>
                    )}
                </div>
            </div>
            <div id="main">
                <div className="tree-list">
                    <h2>{data.treeData && data.treeData.name}</h2>
                    {data.treeData && data.treeData.trees && data.treeData.trees.length > 0 ? (
                        data.treeData.trees.map((tree) => (
                            <div id="tree-block" key={tree.id} onClick={() => handleTreeClick(tree)}>
                                <img src={tree.image} alt={tree.name} />
                                <div id="tree-info">
                                    <p>Image licensed under {tree.imageLicense}. <a href={tree.imageLicenseUrl}>View the full license.</a></p>
                                    <h3>{tree.name} tree</h3>
                                    <p>{tree.species} - {tree.age} years old</p>
                                    <p>Status: {tree.status}</p>
                                </div>
                            </div>
                        )) 
                    ) : (
                        <p>No tree data found, is the server online?</p>
                    )}
                </div>
                {selectedTree && (
                    <div className="selected-tree">
                        <h2>{selectedTree.name} Tree - Information</h2>
                        <h3>About</h3>
                        <p>{selectedTree.description}</p>
                        <p>This tree is located at {selectedTree.location}.</p>
                        <a href="#" onClick={() => setSelectedTree(null)}>Deselect this tree</a>
                        <h3>Status</h3>
                        <p>{selectedTree.detailedStatus}</p>
                        <p>Last assessed {renderLongDateFormat(selectedTree.lastAssessed)} by {selectedTree.lastAssessedBy}</p>
                        <h3>User Comments</h3>
                        <ul>{fetchUserComments().map((comment, index) => (
                                <React.Fragment key={index}>
                                    <li>{comment}</li>
                                </React.Fragment>
                                ))
                            }
                        </ul>
                        <h3>Leave a comment</h3>
                        <p>Comments are anonymous. You will not be able to delete your comment once it has been submitted.</p>
                        <p>Contact an administrator if you require a comment to be deleted.</p>
                        <form id="comment-form" onSubmit={handleSubmitComment}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your comment here"
                            />
                            <br></br>
                            <button type="submit">Submit Comment</button>
                        </form>
                    </div>
                )}
                {!selectedTree && (
                    <div>
                        <h2>Tree Information Will Appear Here</h2>
                        <p>Select a tree to view more information about it, including its status, when it was last assessed and who last assessed it.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
