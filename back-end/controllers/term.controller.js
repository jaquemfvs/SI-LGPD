const { Term, Version, Log } = require("../models");

class TermController {
  async createVersion(req, res) {
    const { version } = req.body;

    if (!version) {
      return res.status(400).json({ message: "Version is required." });
    }

    try {
      const existingVersion = await Version.findOne({ where: { version } });
      if (existingVersion) {
        return res.status(400).json({ message: "Version already exists." });
      }

      const newVersion = await Version.create({ version });
      res.status(201).json(newVersion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating version." });
    }
  }

  async createTerm(req, res) {
    const { name, description, versionId, optional } = req.body;

    if (!name || !description || !versionId) {
      return res.status(400).json({ message: "Name, description, and versionId are required." });
    }

    try {
      const newTerm = await Term.create({ name, description, versionId, optional });
      res.status(201).json(newTerm);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating term." });
    }
  }

  async createLog(req, res) {
    const { userId, changeDate, signed, termId } = req.body;

    if (!userId || !changeDate || signed === undefined || !termId) {
      return res.status(400).json({ message: "UserId, changeDate, signed, and termId are required." });
    }

    try {
      const newLog = await Log.create({ userId, changeDate, signed, termId });
      res.status(201).json(newLog);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating log." });
    }
  }

  async fetchTermsByVersionId(req, res) {
    const { versionId } = req.params;

    if (!versionId) {
      return res.status(400).json({ message: "Version ID is required." });
    }

    try {
      const terms = await Term.findAll({ where: { versionId } });
      res.status(200).json(terms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching terms." });
    }
  }

  async fetchTermById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Term ID is required." });
    }

    try {
      const term = await Term.findByPk(id);
      if (!term) {
        return res.status(404).json({ message: "Term not found." });
      }
      res.status(200).json(term);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching term." });
    }
  }

  async fetchLatestVersionId(req, res) {
    try {
      // Fetch the latest version based on the createdAt column
      const latestVersion = await Version.findOne({
        order: [["createdAt", "DESC"]],
      });

      if (!latestVersion) {
        return res.status(404).json({ message: "No versions found." });
      }

      // Return only the ID of the latest version
      res.status(200).json({ versionId: latestVersion.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching latest version ID." });
    }
  }

  async fetchTermsFromLatestVersion(req, res) {
    try {
      // Fetch the latest version based on the createdAt column
      const latestVersion = await Version.findOne({
        order: [["createdAt", "DESC"]],
      });

      if (!latestVersion) {
        return res.status(404).json({ message: "No versions found." });
      }

      // Fetch all terms associated with the latest version ID
      const terms = await Term.findAll({ where: { versionId: latestVersion.id } });

      res.status(200).json({
        version: {
          id: latestVersion.id,
          name: latestVersion.version,
        },
        terms,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching terms from the latest version." });
    }
  }
}

module.exports = new TermController();
