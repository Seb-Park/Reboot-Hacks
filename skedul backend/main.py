import json
from urllib.request import Request, urlopen

test_json = """{"study_sessions": [{"timestamp": 5, "start": 400, "duration": 45, "rating": 1, "time_before:": 15}, 
{"timestamp": 3, "start": 500, "duration": 60, "rating": 2, "time_before:": 50}], "times_free": [[300, 500], [600, 800],
 [900, 1000]]} """

"""
{"timestamp": 3, "start": 200, "duration": 20, "rating": 0, "time_before:": 10}, 
{"timestamp": 3, "start": 700, "duration": 60, "rating": 2, "time_before:": 10}, 
{"timestamp": 3, "start": 400, "duration": 40, "rating": 1, "time_before:": 10}
"""

req = Request("https://pokeapi.co/api/v2/pokemon/1", headers={'User-Agent': 'Mozilla/5.0'})
webpage = urlopen(req).read()
data = json.loads(test_json)
# print(data)


# for time->study success model
class StudyData:

    def __init__(self, start_time, end_time, rating):
        """

        :param start_time: starting time of the study block
        :param end_time: ending time of the study block (exclusive)
        :param rating: how productive the study block was (0, 1, 2)
        """
        self.time_block = (start_time, end_time)
        self.rating = rating


# for the productivity timeline
class TimelineBlock:

    def __init__(self, time_range, average_rating):
        self.time_range = time_range
        self.rating = average_rating

# sorting algorithm
def bubble_sort(nums):
    # We set swapped to True so the loop looks runs at least once
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(nums) - 1):
            if nums[i] > nums[i + 1]:
                # Swap the elements
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
                # Set the flag to True so we'll loop again
                swapped = True


class SuggestionMaker:
    """
    JSON will look like this:
    "study_sessions": [
    {
        "timestamp": firebase.Timestamp(), //timestamp of object
        "start": 480 (min), //minutes since 12:00am
        "duration": 45 (min), //duration of sess
        "rating": 1 (possible [0, 1, 2]),
        "time_before": 15? (time since last event [study sess, other commitment], could be null),
    }
    ...
    ...
    ...
    ]
    """
    def __init__(self, parsed_json):
        self.previous_sessions = parsed_json["study_sessions"]
        self.original_available_times = parsed_json["times_free"]
        self.available_times = []
        # turn into tuples
        for item in self.original_available_times:
            self.available_times.append(tuple(item))
        print("AVAILABLE:", self.available_times)

        print("Previous Sessions:", self.previous_sessions)
        print("Free Times:", self.available_times)

        self.study_effectiveness_data = []
        for session in self.previous_sessions:
            self.study_effectiveness_data.append(StudyData(session["start"], session["start"] + session["duration"],
                                                           session["rating"]))

        # timeline of session times and average rating
        timeline = {}  # range (tuple) and average rating value for that range. tuples will start overlapped
        for study_data in self.study_effectiveness_data:
            timeline[study_data.time_block] = study_data.rating

        # make intersections into new StudyData objects if needed (they aren't equal in rating)
        # only checks for the smaller range (will go through all, so all intersections should be found)
        self.cut_studies = {}
        self.lone_studies = timeline.copy()  # studies that don't overlap
        self.final_timeline = {}
        print("Lone studies:", self.lone_studies)

        def intersection_between(tr1, tr2, initial_intersection, get_length=False):
            """
            given that an intersection exists:
            :param tr1: first time range tr1
            :param tr2: time range tr2 (intersection sensed by bounds on tr1)
            :return: time range of the intersection between the two (i1, i2)
            """
            if tr2[0] < tr1[0] < tr2[1]:  # left side of tr1 inside bounds of tr2
                i1 = tr1[0]
                tr1a = (tr2[0], tr1[0])  # new value excluding overlap
            else:
                i1 = tr2[0]
                tr1a = (tr1[0], tr2[0])

            if tr2[0] < tr1[1] < tr2[1]:  # right side of tr1 inside bounds of tr2
                i2 = tr1[1]
                tr2a = (tr1[1], tr2[1])
            else:
                i2 = tr2[1]
                tr2a = (tr2[1], tr1[1])

            if initial_intersection:
                self.cut_studies[tr1a] = timeline[tr1]
                self.cut_studies[tr2a] = timeline[tr2]
                print("Keys:", tr1, tr2)
                # if dictionary contains item:
                if tr1 in self.lone_studies:
                    del self.lone_studies[tr1]  # remove the original studies
                if tr2 in self.lone_studies:
                    del self.lone_studies[tr2]

            intersection_range = (i1, i2)

            if get_length:
                print("TR1:", tr1)
                print(i2-i1)
                print(timeline[tr1])
                return tuple((i2 - i1, timeline[tr1]))
            else:
                return intersection_range

        def ranges_touching(range_1, range_2):
            if (range_2[0] < range_1[0] < range_2[1]) or (
                    range_2[0] < range_1[1] < range_2[1]) or (range_1[0] < range_2[0] < range_1[1]) or (
                    range_1[0] < range_2[1] < range_1[1]):
                return True
            else:
                return False

        for time_range in timeline.keys():
            timeline_truncated = list(timeline.keys()).copy()
            timeline_truncated.remove(time_range)
            for time_range2 in timeline_truncated:
                if (time_range2[0] < time_range[0] < time_range2[1]) or (
                        time_range2[0] < time_range[1] < time_range2[1]):
                    intersection = intersection_between(time_range, time_range2, True)
                    if intersection not in self.cut_studies:  # no repeat intersections
                        intersection_rating = float(timeline[time_range] + timeline[time_range2]) / 2
                        print(intersection_rating)
                        self.cut_studies[intersection] = intersection_rating
                    else:
                        pass

        # combine cut_studies and lone_studies for overall timeline
        for cut_study in self.cut_studies:
            self.final_timeline[cut_study] = self.cut_studies[cut_study]
        for lone_study in self.lone_studies:
            self.final_timeline[lone_study] = self.lone_studies[lone_study]

        # for study in self.final_timeline:
        #     print(study, self.final_timeline[study])

        # now, compare given timeline with the available schedule
        self.suggestions = {}  # available_time (tuple) -> length of intersection (for weight) and rating from before
        # (tuple in total)
        for available_time in self.available_times:
            for info_range in self.final_timeline:
                if ranges_touching(available_time, info_range):
                    length_and_weight = intersection_between(info_range, available_time, False, True)
                    available_time_length = available_time[1] - available_time[0]
                    # change tuple value into a weight (int)
                    # store weight for suggestion decision
                    if available_time in self.suggestions:
                        self.suggestions[available_time] += (length_and_weight[0] / available_time_length) * \
                                                           length_and_weight[1]
                    else:
                        self.suggestions[available_time] = (length_and_weight[0]/available_time_length) * length_and_weight[1]
                    # intersection_between: length of intersection (for weight) and rating from before
                    # BUGGED but fix later

        # rank them (give top five)
        bubble_sort(self.suggestions)
        self.suggestion_rankings = self.suggestions.copy()  # ranked from best to worst
        if len(self.suggestion_rankings) >= 5:
            self.suggestion_rankings = self.suggestion_rankings[:5] # top five

    def best_times(self):
        return self.suggestion_rankings

    all_knowledge = []


suggestion_maker = SuggestionMaker(data)

"""
AARON: HERE IS THE RETURN STATEMENT
"""
print("RAW TIMELINE:", suggestion_maker.best_times())
