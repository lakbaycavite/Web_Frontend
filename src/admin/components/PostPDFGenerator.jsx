import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { HiDocumentText } from 'react-icons/hi';
import PostListPDF from './PostListPDF';
import { useAuthContext } from '../../hooks/useAuthContext';
import api from '../../lib/axios';

const PostPDFGenerator = ({ currentPosts }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();

    // Calculate visible and hidden posts from current posts
    const totalVisible = currentPosts.filter(post => !post.is_hidden).length;
    const totalHidden = currentPosts.filter(post => post.is_hidden).length;

    // Function to generate PDF with current posts
    const generateCurrentPostsPDF = async () => {
        setIsLoading(true);
        try {
            // Generate the PDF blob
            const blob = await pdf(
                <PostListPDF
                    posts={currentPosts}
                    totalVisible={totalVisible}
                    totalHidden={totalHidden}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_Posts_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch all posts and generate PDF
    const generateAllPostsPDF = async () => {
        setIsLoading(true);
        try {
            // Fetch all posts
            const response = await api.get('/admin/post?limit=1000', {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const allPosts = response.data.posts || [];
            const allVisible = allPosts.filter(post => !post.is_hidden).length;
            const allHidden = allPosts.filter(post => post.is_hidden).length;

            // Generate the PDF blob
            const blob = await pdf(
                <PostListPDF
                    posts={allPosts}
                    totalVisible={allVisible}
                    totalHidden={allHidden}
                />
            ).toBlob();

            // Save the blob as a file
            saveAs(blob, `Lakbay_Cavite_All_Posts_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-primary btn-sm gap-1">
                {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                ) : (
                    <HiDocumentText className="h-5 w-5" />
                )}
                Export PDF
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <a onClick={generateCurrentPostsPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                        Current Page Posts
                    </a>
                </li>
                <li>
                    <a onClick={generateAllPostsPDF} className={isLoading ? "opacity-50 cursor-wait" : ""}>
                        All Posts
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default PostPDFGenerator;