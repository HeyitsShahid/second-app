package bmt;

package com.example.demo;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
public class Demo {
	public static void main(String[] args) {
	       String url = "jdbc:oracle:thin:@//localhost:1521/XE";
	       String user = "user";
	       String password = "Amueee@23";
	        try {
	        	Class.forName("oracle.jdbc.OracleDriver");
	        	System.out.println("Driver loaded Successfully");  
	        	Connection connection= DriverManager.getConnection(url,user,password); 
	        	System.out.println("Connection is sucessfull");
	        	String query = "Insert into student(id,name)    values(101,'ram')";
	                Statement statement = connection.createStatement();
	                statement.execute(query);
		    } 
			catch (ClassNotFoundException e) {
	                e.printStackTrace();
	        	} 
			catch (SQLException throwables) {
	            	throwables.printStackTrace();
	        }
	    }
	}
