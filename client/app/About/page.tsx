"use client"
// pages/about.js
import React, { useState } from 'react';
import { Card, Typography, List, Pagination, Divider } from 'antd';


import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice"
const { Title, Paragraph } = Typography;

const skillsData = [
  'React.js', 'Node.js', 'Express.js', 'Redux', 'Tailwind CSS', 'JavaScript',
  'TypeScript', 'HTML5', 'CSS3', 'Bootstrap', 'Ant Design', 'Django', 'Java',
  'Python', 'C++', 'SQL', 'MongoDB', 'Machine Learning', 'Git', 'Docker'
];
const About = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const currentSkills = skillsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const dispatch = useDispatch();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = storedUser;
      console.log(user)
      console.log("Retrieved user:", user);
      dispatch(loginSuccess(user));
    }
  }, []);
  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
      {/* About Me Section */}
      <Card style={{ marginBottom: 20 }}>
        <Title level={2}>About Me</Title>
        <Paragraph>
          Hi, I'm Dattu Ajay, a passionate software engineering student specializing in full stack development and UI/UX design.
          I'm proficient in various technologies like React, Node.js, and Tailwind CSS, with a strong interest in building intuitive,
          efficient web applications.
        </Paragraph>
        <Paragraph>
          Apart from coding, I enjoy teaching, going to the gym, and exploring 3D design. I have participated in several hackathons,
          including the Smart India Hackathon and the Prajwala Hackathon, where I gained experience in team collaboration and problem-solving.
        </Paragraph>
      </Card>

      <Divider />

      {/* Skills Section with Pagination */}
      <Card>
        <Title level={2}>My Skills</Title>
        <List
          dataSource={currentSkills}
          renderItem={(skill) => <List.Item>{skill}</List.Item>}
        />
        <Pagination
          current={currentPage}
          total={skillsData.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: 20, textAlign: 'center' }}
        />
      </Card>
    </div>
  );
};

export default About;
