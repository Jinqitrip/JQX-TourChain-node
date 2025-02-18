package com.jinqitrip.jtcn.modules.schedule.service;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final TimeSlotRepository slotRepo;

    public void createSlots(Guide guide, List<TimeSlotCreateDTO> dtos) {
        List<TimeSlot> existing = slotRepo.findByGuideAndDate(
            guide, LocalDate.now()
        );

        dtos.stream()
            .map(dto -> convertToEntity(dto, guide))
            .forEach(newSlot -> {
                if (hasOverlap(existing, newSlot)) {
                    throw new ConflictException("时间段冲突");
                }
                slotRepo.save(newSlot);
                existing.add(newSlot);
            });
    }

    private boolean hasOverlap(List<TimeSlot> existing, TimeSlot newSlot) {
        return existing.stream().anyMatch(existingSlot ->
            newSlot.getStartTime().isBefore(existingSlot.getEndTime()) &&
            newSlot.getEndTime().isAfter(existingSlot.getStartTime())
        );
    }
}