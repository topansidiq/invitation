import GuestService from "../services/GuestService.js";

class GuestController {
    async index(req, res) {
        try {
            const guests = await GuestService.listGuests();
            if (!guests || guests.length === 0)
                return res.status(200).json({
                    status: "success",
                    message: "No guests found",
                    data: [],
                });

            res.status(200).json({
                status: "success",
                message: `Retrieved ${guests.length} guests`,
                data: guests,
            });
        } catch (error) {
            console.error("Error at GuestController.index:", error);
            res
                .status(500)
                .json({ status: "error", message: "Something went wrong", error: error.message });
        }
    }

    async show(req, res) {
        try {
            const id = req.params.id;
            const guest = await GuestService.getGuest(id);
            if (!guest)
                return res
                    .status(404)
                    .json({ status: "error", message: `Guest with ID ${id} not found` });

            res
                .status(200)
                .json({ status: "success", message: "Guest retrieved", data: guest });
        } catch (error) {
            console.error("Error at GuestController.show:", error);
            res
                .status(500)
                .json({ status: "error", message: "Something went wrong", error: error.message });
        }
    }

    async store(req, res) {
        try {
            const guest = await GuestService.createGuest(req.body);
            res
                .status(201)
                .json({ status: "success", message: "Guest created", data: guest });
        } catch (error) {
            console.error("Error at GuestController.store:", error);
            res
                .status(500)
                .json({ status: "error", message: "Something went wrong", error: error.message });
        }
    }

    async update(req, res) {
        try {
            const result = await GuestService.updateGuest(req.params.id, req.body);
            res
                .status(200)
                .json({ status: "success", message: "Guest updated", data: result });
        } catch (error) {
            console.error("Error at GuestController.update:", error);
            res
                .status(500)
                .json({ status: "error", message: "Something went wrong", error: error.message });
        }
    }

    async destroy(req, res) {
        try {
            const result = await GuestService.deleteGuest(req.params.id);
            res
                .status(200)
                .json({ status: "success", message: "Guest deleted", data: result });
        } catch (error) {
            console.error("Error at GuestController.destroy:", error);
            res
                .status(500)
                .json({ status: "error", message: "Something went wrong", error: error.message });
        }
    }

    async drop(req, res) {
        try {
            const result = await GuestService.dropGuests();
            res
                .status(200)
                .json({ status: "success", message: "All guests deleted", data: result });
        } catch (error) {
            console.error("Error at GuestController.drop:", error);
            res
                .status(500)
                .json({ status: "error", message: "Something went wrong", error: error.message });
        }
    }
}

export default new GuestController();
