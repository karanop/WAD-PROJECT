package com.socialklub.servlet;

import com.google.gson.Gson;
import com.socialklub.model.Event;
import com.socialklub.util.DatabaseUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/events/*")
public class EventServlet extends HttpServlet {

    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        String pathInfo = req.getPathInfo();
        
        try (Connection conn = DatabaseUtil.getConnection()) {
            if (pathInfo == null || pathInfo.equals("/")) {
                // Get all events
                List<Event> events = new ArrayList<>();
                String sql = "SELECT * FROM events ORDER BY event_date ASC, event_time ASC";
                try (PreparedStatement stmt = conn.prepareStatement(sql);
                     ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        events.add(mapResultSetToEvent(rs));
                    }
                }
                resp.getWriter().write(gson.toJson(events));
            } else {
                // Get event by ID
                int id = Integer.parseInt(pathInfo.substring(1));
                String sql = "SELECT * FROM events WHERE id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setInt(1, id);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            resp.getWriter().write(gson.toJson(mapResultSetToEvent(rs)));
                        } else {
                            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                            resp.getWriter().write("{\"message\": \"Event not found\"}");
                        }
                    }
                }
            }
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        Event event = gson.fromJson(req.getReader(), Event.class);
        
        try (Connection conn = DatabaseUtil.getConnection()) {
            String sql = "INSERT INTO events (title, description, event_date, event_time, location, image_url, capacity, slots_available, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setString(1, event.getTitle());
                stmt.setString(2, event.getDescription());
                stmt.setDate(3, event.getEventDate());
                stmt.setTime(4, event.getEventTime());
                stmt.setString(5, event.getLocation());
                stmt.setString(6, event.getImageUrl());
                stmt.setInt(7, event.getCapacity());
                stmt.setInt(8, event.getCapacity()); // Initial slots available = capacity
                stmt.setInt(9, event.getCreatedBy()); // Assume sent in payload or from token (in a real app, parsed from JWT)
                
                int affectedRows = stmt.executeUpdate();
                if (affectedRows > 0) {
                    try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            event.setId(generatedKeys.getInt(1));
                            resp.setStatus(HttpServletResponse.SC_CREATED);
                            resp.getWriter().write(gson.toJson(event));
                        }
                    }
                }
            }
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    private Event mapResultSetToEvent(ResultSet rs) throws SQLException {
        Event event = new Event();
        event.setId(rs.getInt("id"));
        event.setTitle(rs.getString("title"));
        event.setDescription(rs.getString("description"));
        event.setEventDate(rs.getDate("event_date"));
        event.setEventTime(rs.getTime("event_time"));
        event.setLocation(rs.getString("location"));
        event.setImageUrl(rs.getString("image_url"));
        event.setCapacity(rs.getInt("capacity"));
        event.setSlotsAvailable(rs.getInt("slots_available"));
        event.setCreatedBy(rs.getInt("created_by"));
        event.setCreatedAt(rs.getTimestamp("created_at"));
        return event;
    }
}
