import GuestService from "../service/GuestService.js";

class GuestController {
    async index(req, res) {
        console.info(`Request ${req.method} ${req.originalUrl} from ${req.ip}`);
        try {
            const guests = await GuestService.listGuests();
            if (!guests) res.status(200).json({ status: 'success', message: 'Nothing guest found!', data: guests });
            res.status(200).json({ status: 'success', message: `Successfully retieved ${guests.length} guests data!`, data: guests });
        } catch (error) {
            console.error('Error at Guest index', error);
            res.status(500).json({ status: 'error', message: 'Something went wrong!', error: error.message });
        }
    }
    async show(req, res) {
        console.info(`Request ${req.method} ${req.originalUrl} from ${req.ip}`);
        try {
            const id = req.params.id;
            const guest = await GuestService.getGuest(id);
            if (!guest) return res.status(200).json({ status: 'success', message: `Nothing guest with id ${id} found!`, data: guest });
            res.status(200).json({ status: 'success', message: `Successfully get guest with id ${id}`, data: guest });
        } catch (error) {
            console.error('Error at Guest show', error);
            res.status(500).json({ status: 'error', message: 'Something went wrong!', error: error.message });
        }
    }
    async store(req, res) {
        console.info(`Request ${req.method} ${req.originalUrl} from ${req.ip}`);
        try {
            const guest = await GuestService.createGuest(req.body);
            res.status(200).json({ status: 'success', message: 'Successfully create new guest!', data: guest });
        } catch (error) {
            console.error('Error at Guest store', error);
            res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
        }
    }
    async update(req, res) {
        console.info(`Request ${req.method} ${req.originalUrl} from ${req.ip}`);
        try {
            const guest = await GuestService.updateGuest(req.params.id, req.body);
            res.status(200).json({ status: 'success', message: `Successfully updated guest with id ${req.params.id}`, data: guest });
        } catch (error) {
            console.error('Error at Guest update', error);
            res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
        }
    }
    async destroy(req, res) {
        console.info(`Request ${req.method} ${req.originalUrl} from ${req.ip}`);
        try {
            const result = await GuestService.deleteGuest(req.params.id);
            if (!result) return res.status(200).json({ status: 'success', message: 'Nothing user found or already deleted', data: result });
            return res.status(200).json({ status: 'success', message: 'Successfully deleted guest', data: result });
        } catch (error) {
            console.error('Error at Guest destroy', error);
            res.status(500).json({ status: 'success', message: 'Something went wrong', error: error.message });
        }
    }
    async drop(req, res) {
        console.info(`Request ${req.method} ${req.originalUrl} from ${req.ip}`);
        try {
            const result = await GuestService.dropGuests();
            if (!result) return res.status(200).json({ status: 'success', message: 'Nothing guests deleted!', data: result });
            res.status(200).json({ status: 'success', message: 'Successfully drop table guest', data: result });
        } catch (error) {
            console.error('Error at Guest drop', error);
            res.status(500).json({ status: 'success', message: 'Something went wrong', error: error.message });
        }
    }
}

export default new GuestController();