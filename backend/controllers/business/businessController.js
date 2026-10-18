"use strict";
const { BusinessOverview, BusinessNode } = require("../../models");

const businessController = {
  // --- Overview ---
  async getOverview(req, res) {
    try {
      let overview = await BusinessOverview.findOne();
      if (!overview) {
        overview = await BusinessOverview.create({
          title_part1: "Connecting",
          title_part2: "Markets",
          description1: "First paragraph...",
          description2: "Second paragraph...",
          business_data: [
            {
              title: "Business Overview & Operations",
              heading: "Comprehensive view of MIDI's mineral sector and technical operations.",
              description: "Explore our institutional support framework across mineral development, testing laboratories, training centers, value addition, and technical facilitation.",
              features: [
                "Supply chain connectivity",
                "Multi-location warehousing",
                "Cross-border trading",
                "Logistics management",
                "Commercial partnerships"
              ]
            }
          ],
          business_categories: [
            {
              icon: "Package",
              title: "Import & Export",
              growth: "Growing",
              description: "Cross-border trade and sourcing",
              topFocus: ["International Markets", "Supplier Networks", "Trade Agreements"]
            },
            {
              icon: "Building2",
              title: "Warehousing",
              growth: "Expanding",
              description: "Strategic storage facilities",
              topFocus: ["Inventory Management", "Secure Storage", "Strategic Locations"]
            },
            {
              icon: "Truck",
              title: "Distribution & Logistics",
              growth: "Scaling",
              description: "Reliable movement of goods",
              topFocus: ["Supply Networks", "Regional Delivery", "Transport Efficiency"]
            }
          ],
          key_metrics: [
            {
              title: "Business Areas",
              value: "Multiple",
              change: "Diversified",
              period: "Integrated Operations",
              icon: "Database",
              color: "from-amber-600 to-[#ba8200]"
            },
            {
              title: "Commercial Reach",
              value: "Regional",
              change: "Expanding",
              period: "Market Operations",
              icon: "TrendingUp",
              color: "from-green-500 to-emerald-500"
            },
            {
              title: "Warehousing",
              value: "Strategic",
              change: "Locations",
              period: "Infrastructure",
              icon: "Building2",
              color: "from-amber-500 to-orange-500"
            },
            {
              title: "Partnerships",
              value: "Growing",
              change: "Network",
              period: "Commercial Relations",
              icon: "Filter",
              color: "from-purple-500 to-pink-500"
            }
          ],
          operations_data: [
            { area: "Import Operations", focus: "Sourcing & Trade", infrastructure: "Integrated", status: "Active" },
            { area: "Export Operations", focus: "Market Access", infrastructure: "Integrated", status: "Active" },
            { area: "Warehousing", focus: "Storage & Inventory", infrastructure: "Multi-location", status: "Active" },
            { area: "Logistics", focus: "Movement of Goods", infrastructure: "Regional", status: "Active" },
            { area: "Distribution", focus: "Supply Networks", infrastructure: "Growing", status: "Active" }
          ],
          quick_stats: {
            left: [{ title: "Reliable", subtitle: "Partnerships" }],
            right: [{ title: "Growing", subtitle: "Network" }]
          },
          network_operations: [
            { title: "Supply Chain", description: "Connecting suppliers and markets", full_description: "Detailed information about our supply chain connectivity.", icon: "Package" },
            { title: "Distribution", description: "Reliable movement of goods", full_description: "Detailed information about our distribution networks.", icon: "Truck" },
            { title: "Warehousing", description: "Strategic storage facilities", full_description: "Detailed information about our warehousing infrastructure.", icon: "Building2" },
            { title: "Commercial Trade", description: "Business partnerships & sourcing", full_description: "Detailed information about our commercial trade activities.", icon: "TrendingUp" }
          ],
          page_metadata: {
            hero_section: {
                title: "Business Overview & Operations",
                description: "Explore our diversified network of business activities. Our overview provides insights into our warehousing infrastructure, distribution networks, import/export operations, and overall growth trends across multiple locations.",
                bg_image: ""
            },
            key_metrics_info: { title: "Key Metrics Grid", description: "Overview of our key performance indicators." },
            key_verticals_info: { title: "Key Verticals", icon: "PieChart" },
            operations_table_info: { title: "Business Operations", description: "Overview of key business areas and infrastructure", icon: "MapPin" },
            network_operations_info: { title: "Network Operations", description: "Our network operations connect different areas." }
          }
        });
      }
      return res.status(200).json(overview);
    } catch (error) {
      console.error("Error fetching Business Overview:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async updateOverview(req, res) {
    try {
      const { title_part1, title_part2, description1, description2, business_data, business_categories, key_metrics, operations_data, quick_stats, network_operations, page_metadata } = req.body;
      let overview = await BusinessOverview.findOne();
      
      if (!overview) {
        overview = await BusinessOverview.create({
          title_part1, title_part2, description1, description2, business_data, business_categories, key_metrics, operations_data, quick_stats, network_operations, page_metadata
        });
      } else {
        await overview.update({
          title_part1, title_part2, description1, description2, business_data, business_categories, key_metrics, operations_data, quick_stats, network_operations, page_metadata
        });
      }
      return res.status(200).json({ message: "Overview updated successfully", overview });
    } catch (error) {
      console.error("Error updating Business Overview:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // --- Nodes ---
  async getNodes(req, res) {
    try {
      const nodes = await BusinessNode.findAll({
        order: [["mobile_order", "ASC"]]
      });
      return res.status(200).json(nodes);
    } catch (error) {
      console.error("Error fetching Business Nodes:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async createNode(req, res) {
    try {
      const { id_string, title, description, icon, position_x, position_y, mobile_order } = req.body;
      const node = await BusinessNode.create({
        id_string, title, description, icon, position_x, position_y, mobile_order
      });
      return res.status(201).json({ message: "Node created successfully", node });
    } catch (error) {
      console.error("Error creating Business Node:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async updateNode(req, res) {
    try {
      const { id } = req.params;
      const { id_string, title, description, icon, position_x, position_y, mobile_order } = req.body;
      const node = await BusinessNode.findByPk(id);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }
      await node.update({
        id_string, title, description, icon, position_x, position_y, mobile_order
      });
      return res.status(200).json({ message: "Node updated successfully", node });
    } catch (error) {
      console.error("Error updating Business Node:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async deleteNode(req, res) {
    try {
      const { id } = req.params;
      const node = await BusinessNode.findByPk(id);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }
      await node.destroy();
      return res.status(200).json({ message: "Node deleted successfully" });
    } catch (error) {
      console.error("Error deleting Business Node:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = businessController;
