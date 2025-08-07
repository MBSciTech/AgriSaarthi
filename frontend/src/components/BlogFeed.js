import React, { useEffect, useState } from "react";

// Enhanced BlogFeed Component
function BlogFeed() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState({});
  const [commenting, setCommenting] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentsMap, setCommentsMap] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/farmers/blogs/");
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (blogId) => {
    if (liking[blogId]) return;
    
    setLiking(prev => ({ ...prev, [blogId]: true }));
    try {
      const response = await fetch(`http://localhost:8000/api/farmers/blogs/${blogId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBlogs(prev => prev.map(blog => 
          blog.id === blogId 
            ? { ...blog, likes_count: data.likes_count, is_liked: data.is_liked }
            : blog
        ));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLiking(prev => ({ ...prev, [blogId]: false }));
    }
  };

  const handleComment = async (blogId) => {
    if (!newComment[blogId]?.trim() || commenting[blogId]) return;
  
    setCommenting(prev => ({ ...prev, [blogId]: true }));
  
    try {
      const response = await fetch(`http://localhost:8000/api/farmers/blogs/${blogId}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment[blogId] })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Comment error:", errorData);
        return;
      }
  
      const newCommentData = await response.json();
  
      // Update blog comment count
      setBlogs(prev => prev.map(blog =>
        blog.id === blogId
          ? { ...blog, comments_count: (blog.comments_count || 0) + 1 }
          : blog
      ));
  
      // Append comment to local state
      setCommentsMap(prev => ({
        ...prev,
        [blogId]: [...(prev[blogId] || []), newCommentData]
      }));
  
      // Clear comment box
      setNewComment(prev => ({ ...prev, [blogId]: '' }));
  
    } catch (error) {
      console.error("Error commenting:", error);
    } finally {
      setCommenting(prev => ({ ...prev, [blogId]: false }));
    }
  };

  const handleToggleSave = async (blogId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/farmers/blogs/${blogId}/toggle-save/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setBlogs(prev =>
          prev.map(blog =>
            blog.id === blogId ? { ...blog, is_saved: data.saved } : blog
          )
        );
      } else {
        alert("Failed to toggle saved post.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  

  const handleShare = (blogId, content) => {
    const shareUrl = `${window.location.origin}/blogs/${blogId}`;
  
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on AgriSaarthi',
        text: content.slice(0, 100), // Short preview
        url: shareUrl
      }).catch(err => console.log('Share cancelled or failed:', err));
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert("🔗 Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link."));
    }
  };

  const handleSave = (blogId) => {
    // You can customize this logic
    console.log("Saved post:", blogId);
    alert("✅ Post saved!");
  };
  
  const handleDownloadPdf = async (blogId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/farmers/blogs/${blogId}/download-pdf/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        }
      });
  
      if (!response.ok) throw new Error('Failed to download PDF');
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `blog_${blogId}.pdf`;
      a.click();
  
      window.URL.revokeObjectURL(url); // cleanup
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("❌ Failed to download PDF.");
    }
  };
      
  const toggleComments = async (blogId) => {
    const currentlyShown = showComments[blogId];
    setShowComments(prev => ({ ...prev, [blogId]: !currentlyShown }));
  
    // Only fetch if not already loaded
    if (!currentlyShown && !commentsMap[blogId]) {
      try {
        const response = await fetch(`http://localhost:8000/api/farmers/blogs/${blogId}/comments/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          setCommentsMap(prev => ({ ...prev, [blogId]: data }));
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 pb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <h4 className="text-white mb-4 text-center fw-bold">
            <i className="fas fa-seedling me-2"></i>Community Feed
          </h4>
          
          {blogs.length === 0 ? (
            <div className="glass-card p-5 text-center">
              <i className="fas fa-leaf fa-3x text-success mb-3"></i>
              <h5 className="text-muted">No posts yet</h5>
              <p className="text-muted">Be the first to share your farming experience!</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="glass-card mb-4 overflow-hidden">
                {/* Post Header */}
                <div className="p-4 pb-2">
                  <div className="d-flex align-items-center mb-3">
                    <div className="position-relative">
                      {/* Fixed to use expert_advisor.png for all posts */}
                      <img
                        src="/images/roles/expert_advisor.png"
                        alt="Author"
                        className="rounded-circle border border-success"
                        style={{ 
                          width: 48, 
                          height: 48, 
                          objectFit: "cover",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          border:'2px solid rgb(3, 98, 76)'
                        }}
                      />
                      <span 
                        className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                        style={{ width: 14, height: 14 }}
                      ></span>
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-0 fw-bold text-dark">{blog.author_name}</h6>
                      <small className="text-muted d-flex align-items-center">
                        <i className="fas fa-clock me-1"></i>
                        {formatTimeAgo(blog.created_at)}
                        {blog.tags && (
                          <span className="ms-2">
                            <i className="fas fa-tags me-1"></i>
                            {blog.tags}
                          </span>
                        )}
                      </small>
                    </div>
                    <div className="dropdown">
                        <button 
                            className="btn btn-sm btn-outline-secondary rounded-pill dropdown-toggle"
                            type="button"
                            id={`dropdownMenuButton${blog.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fas fa-ellipsis-h"></i>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${blog.id}`}>
                            <li>
                            <a className="dropdown-item" href="#">
                                <i className="fas fa-flag me-2"></i>Report
                            </a>
                            </li>
                            <li>
                            <a className="dropdown-item" href="#" onClick={() => handleShare(blog.id, blog.content)}>
                                <i className="fas fa-share me-2"></i>Share
                            </a>
                            </li>
                            <li>
                            <button className="dropdown-item" onClick={() => handleToggleSave(blog.id)}>
                                <i className={`fas ${blog.is_saved ? 'fa-bookmark' : 'fa-bookmark'} me-2`}></i>
                                {blog.is_saved ? 'Unsave Post' : 'Save Post'}
                            </button>
                            </li>


                            <li>
                                <button className="dropdown-item" onClick={() => handleDownloadPdf(blog.id)}>
                                    <i className="fas fa-file-pdf me-2 text-danger"></i>Download as PDF
                                </button>
                            </li>
                          
                            
                        </ul>
                        </div>


                  </div>

                  {/* Post Content */}
                  <div className="mb-3">
                    <p className="mb-3 lh-base" style={{ fontSize: "1.05rem" }}>
                      {blog.content}
                    </p>

                    {/* Post Image */}
                    {blog.image && (
                      <div className="position-relative">
                        <img
                          src={blog.image}
                          alt="Post"
                          className="img-fluid rounded-3 w-100"
                          style={{ 
                            maxHeight: 400, 
                            objectFit: "cover",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                          }}
                        />
                        <div 
                          className="position-absolute top-0 start-0 w-100 h-100 rounded-3"
                          style={{
                            background: "linear-gradient(45deg, rgba(0,0,0,0.05), transparent 50%)"
                          }}
                        ></div>
                      </div>
                    )}

                    {/* Fixed Poll Section - Now properly checking blog.poll */}
                    {blog.poll && blog.poll.question && (
                      <div className="mt-3 p-3 rounded-3" style={{
                        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                        border: "1px solid #dee2e6"
                      }}>
                        <h6 className="fw-bold mb-3 d-flex align-items-center">
                          <i className="fas fa-poll-h me-2 text-primary"></i>
                          {blog.poll.question}
                        </h6>
                        {blog.poll.choices && blog.poll.choices.length > 0 ? (
                          blog.poll.choices.map((choice, index) => (
                            <div key={index} className="mb-2">
                              <button className="btn btn-outline-primary btn-sm w-100 text-start d-flex align-items-center">
                                <i className="fas fa-circle me-2" style={{ fontSize: "8px" }}></i>
                                <span>{choice.choice_text || choice}</span>
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted small">No poll options available</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Engagement Stats */}
                  <div className="d-flex justify-content-between text-muted small mb-3">
                    <span>
                      <i className="fas fa-heart text-danger me-1"></i>
                      {blog.likes_count} likes
                    </span>
                    <span>
                      <i className="fas fa-comment-dots text-info me-1"></i>
                      {blog.comments_count} comments
                    </span>
                    <span>
                      <i className="fas fa-share-alt text-success me-1"></i>
                      Share
                    </span>
                  </div>
                </div>

                {/* Action Buttons with attractive icons */}
                <div className="border-top px-3 py-3">
  <div className="d-flex justify-content-between gap-2">
    <button 
      className={`btn flex-fill px-2 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 shadow-sm ${
        blog.is_liked ? 'btn-danger text-white' : 'btn-outline-danger'
      }`}
      onClick={() => handleLike(blog.id)}
      disabled={liking[blog.id]}
      style={{ transition: 'all 0.3s ease' }}
    >
      {liking[blog.id] ? (
        <span className="spinner-border spinner-border-sm"></span>
      ) : (
        <i className="fas fa-heart"></i>
      )}
      <span style={{ fontSize: '0.95rem' }}>Like</span>
    </button>

    <button 
      className="btn btn-outline-info flex-fill px-2 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 shadow-sm"
      onClick={() => toggleComments(blog.id)}
      style={{ transition: 'all 0.3s ease' }}
    >
      <i className="fas fa-comment-dots"></i>
      <span style={{ fontSize: '0.95rem' }}>Comment</span>
    </button>

    <button 
        onClick={() => handleShare(blog.id, blog.content)}
      className="btn btn-outline-success flex-fill px-2 py-2 rounded-pill d-flex align-items-center justify-content-center gap-1 shadow-sm"
      style={{ transition: 'all 0.3s ease' }}
    >
      <i className="fas fa-share-alt"></i>
      <span style={{ fontSize: '0.95rem' }}>Share</span>
    </button>
  </div>


                  {/* Comment Section */}
                  {showComments[blog.id] && (
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex mb-3">
                        {/* Fixed to use expert_advisor.png for comments too */}
                        <img
                          src="/images/roles/expert_advisor.png"
                          alt="You"
                          className="rounded-circle me-2"
                          style={{ width: 32, height: 32, objectFit: "cover" }}
                        />
                        <div className="flex-grow-1">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Write a comment..."
                              value={newComment[blog.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ 
                                ...prev, 
                                [blog.id]: e.target.value 
                              }))}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleComment(blog.id);
                                }
                              }}
                            />
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleComment(blog.id)}
                              disabled={commenting[blog.id] || !newComment[blog.id]?.trim()}
                            >
                              {commenting[blog.id] ? (
                                <span className="spinner-border spinner-border-sm"></span>
                              ) : (
                                <i className="fas fa-paper-plane"></i>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="comment-section">
                        {(commentsMap[blog.id] || []).map((comment) => (
                          <div key={comment.id} className="d-flex mb-2">
                            {/* Fixed to use expert_advisor.png for comment authors */}
                            <img
                              src="/images/roles/expert_advisor.png"
                              alt="Commenter"
                              className="rounded-circle me-2"
                              style={{ width: 28, height: 28, objectFit: "cover" }}
                            />
                            <div className="flex-grow-1">
                              <div className="bg-light rounded-3 px-3 py-2">
                                <small className="fw-bold">{comment.author_name || 'Unknown'}</small>
                                <p className="mb-0 small">{comment.content}</p>
                              </div>
                              <small className="text-muted">{formatTimeAgo(comment.created_at)}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Create Post Component (Fixed positioning for mobile)
function CreatePostBox({ profile }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState('');
    const [showPoll, setShowPoll] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollChoices, setPollChoices] = useState(['', '']);
    const [isExpanded, setIsExpanded] = useState(false);
    const [posting, setPosting] = useState(false);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) setImage(file);
    };
  
    const addPollChoice = () => {
      if (pollChoices.length < 4) setPollChoices([...pollChoices, '']);
    };
  
    const removePollChoice = (index) => {
      if (pollChoices.length > 2) {
        setPollChoices(pollChoices.filter((_, i) => i !== index));
      }
    };
  
    const updatePollChoice = (index, value) => {
      const newChoices = [...pollChoices];
      newChoices[index] = value;
      setPollChoices(newChoices);
    };
    
  
    const handleSubmit = async () => {
        if (!content.trim() && !image) return;
      
        setPosting(true);
        try {
          const formData = new FormData();
          formData.append('content', content);
          if (image) formData.append('image', image);
          if (tags) formData.append('tags', tags);
      
          // Fixed poll data structure
          if (showPoll && pollQuestion.trim()) {
            const pollData = {
              question: pollQuestion.trim(),
              choices: pollChoices
                .filter(choice => choice.trim())
                .map(choice => ({ choice_text: choice.trim() }))
            };
            formData.append('poll', JSON.stringify(pollData));
          }
      
          const response = await fetch('http://localhost:8000/api/farmers/blogs/create/', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            },
            body: formData
          });
      
          if (response.ok) {
            setContent('');
            setImage(null);
            setTags('');
            setShowPoll(false);
            setPollQuestion('');
            setPollChoices(['', '']);
            setIsExpanded(false);
            window.location.reload();
          } else {
            const errorData = await response.json();
            console.error("Error details:", errorData);
          }
        } catch (error) {
          console.error('Error creating post:', error);
        } finally {
          setPosting(false);
        }
      };
  
    return (
      <div
        className="create-post-container"
        style={{ zIndex: 1050, maxWidth: '900px',marginLeft:'200px' }}
      >
        <div style={{borderRadius:'50px 50px 0px 0px'}} className="glass-card border border-success p-4 shadow">
          <div className="d-flex align-items-start mb-3">
            <img
              src={`/images/roles/${profile.role}.png`}
              alt="Profile"
              className="rounded-circle me-3"
              style={{ width: 45, height: 45, objectFit: 'cover',border:'2px solid rgb(3, 98, 76)' }}
            />
            <textarea
              className="form-control border-0 bg-light rounded-4 p-2"
              placeholder="What's growing in your mind?"
              rows={isExpanded ? 3 : 2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              style={{ resize: 'none', fontSize: '1rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
            />
          </div>
  
          {isExpanded && (
            <div className="mt-3">
              {/* Tags */}
              <input
                type="text"
                className="form-control form-control-sm mb-3"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
  
              {/* Image Preview */}
              {image && (
                <div className="position-relative mb-3">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="img-fluid rounded-3 shadow-sm"
                    style={{ maxHeight: 200, objectFit: 'cover' }}
                  />
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{ transform: 'translate(30%, -30%)' }}
                    onClick={() => setImage(null)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
  
              {/* Poll UI */}
              {showPoll && (
                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="Poll Question"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                  />
                  {pollChoices.map((choice, index) => (
                    <div key={index} className="input-group input-group-sm mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Option ${index + 1}`}
                        value={choice}
                        onChange={(e) => updatePollChoice(index, e.target.value)}
                      />
                      {pollChoices.length > 2 && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removePollChoice(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  {pollChoices.length < 4 && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={addPollChoice}
                    >
                      <i className="fas fa-plus me-1"></i> Add Option
                    </button>
                  )}
                </div>
              )}
  
              {/* Action Bar */}
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <label className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-camera me-1"></i> Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <button
                    className={`btn btn-sm ${showPoll ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setShowPoll(!showPoll)}
                  >
                    <i className="fas fa-poll-h me-1"></i> Poll
                  </button>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                      setImage(null);
                      setTags('');
                      setShowPoll(false);
                      setPollChoices(['', '']);
                      setPollQuestion('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleSubmit}
                    disabled={posting || (!content.trim() && !image)}
                  >
                    {posting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Posting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-1"></i> Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
// Updated FarmerDashboard Component
function FarmerDashboard({ profile }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "rgb(3, 98, 76)",
        position: "relative",
        overflowX: "hidden"
      }}
    >
      
      {/* Blog Feed */}
      {profile?.role !== 'government_official' && (
        <>
          <BlogFeed />
          <CreatePostBox profile={profile} />
        </>
      )}

      {/* Enhanced styles with responsive fixes */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          box-shadow: 0 8px 32px 0 rgba(34,139,34,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          box-shadow: 0 12px 40px 0 rgba(34,139,34,0.18);
          transform: translateY(-2px);
        }
        
        .comment-section {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .comment-section::-webkit-scrollbar {
          width: 4px;
        }
        
        .comment-section::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }
        
        .comment-section::-webkit-scrollbar-thumb {
          background: #28a745;
          border-radius: 2px;
        }

        /* Fixed positioning for create post */
        .create-post-container {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          padding: 1rem;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .create-post-container {
            position: fixed !important;
            bottom: 70px !important; /* Moved up to avoid navbar collision */
            left: 0 !important;
            transform: none !important;
            width: 100% !important;
            padding: 0.5rem !important;
            z-index: 1040 !important; /* Below navbar but above content */
          }
          
          /* Add padding to main content to prevent overlap */
          .container.mt-4.pb-5 {
            padding-bottom: 200px !important; /* Space for create post box */
          }
        }

        @media (max-width: 576px) {
          .create-post-container {
            bottom: 80px !important; /* Even more space on smaller screens */
          }
        }
      `}</style>
    </div>
  );
}

export { BlogFeed, CreatePostBox };