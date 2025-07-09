import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SupportReplies = () => {
    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState({});

    // ✅ Pending support mesajlarını gətir
    const fetchMessages = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/support/pending");

            setMessages(res.data);
        } catch (error) {
            toast.error("Failed to load support messages");
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // ✅ Admin cavabı göndər
    // ✅ Admin cavabı göndər
    const handleReply = async (id) => {
        if (!replyText[id]) {
            toast.error("Reply can't be empty");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/support/reply/${id}`, {
                reply: replyText[id],
            });

            toast.success("Reply sent!");
            fetchMessages(); // siyahını yenilə
            setReplyText((prev) => ({ ...prev, [id]: "" }));
        } catch (error) {
            toast.error("Failed to send reply");
            fetchMessages(); // ✅ siyahı yenilənir
        }
    };

    // ✅ Admin mesajı silir
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/support/delete/${id}`);
            toast.success("Message deleted successfully");
            fetchMessages(); // siyahını yenilə
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };


    return (
        <div className="container mt-5">
            <h2>Pending Support Messages</h2>

            {messages.length === 0 ? (
                <p>No support messages pending.</p>
            ) : (
                messages.map((msg) => (
                    <div key={msg._id} className="border p-3 mb-4 rounded">
                        <h5>{msg.title}</h5>
                        <p>{msg.description}</p>
                        {msg.image && (
                            <img
                                src={`http://localhost:5000/uploads/support/${msg.image}`}
                                alt="Support"
                                style={{ width: "150px", borderRadius: "8px" }}
                            />
                        )}
                        <div className="form-group mt-3">
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Write your reply..."
                                value={replyText[msg._id] || ""}
                                onChange={(e) =>
                                    setReplyText((prev) => ({
                                        ...prev,
                                        [msg._id]: e.target.value,
                                    }))
                                }
                            />
                            <button
                                className="btn btn-success mt-2"
                                onClick={() => handleReply(msg._id)}
                            >
                                Send Reply
                            </button>
                            <button
                                className="btn btn-danger mt-2 ms-2"
                                onClick={() => handleDelete(msg._id)}
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SupportReplies;
